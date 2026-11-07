'use strict';

/* ---------- 1. Konstanta & helper ---------- */
const KEY = {
  session: 'ut_session',
  users: 'ut_users',
  books: 'ut_books',
  cart: 'ut_cart',
  orders: 'ut_orders',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(\+62|62|0)8\d{7,12}$/;
const ONGKIR = { JNE: 15000, 'Pos Indonesia': 12000, 'J&T': 14000, SiCepat: 13000 };
const STEPS = ['Diproses', 'Dikirim', 'Dalam Perjalanan', 'Diterima'];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const rupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
const parseRupiah = (s) => Number(String(s).replace(/\D/g, '')) || 0;

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* abaikan */ }
}

/* Buat elemen DOM tanpa innerHTML */
function el(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  kids.flat().forEach((c) => node.append(c));
  return node;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function nowStamp() {
  return `${todayISO()} ${new Date().toTimeString().slice(0, 8)}`;
}
function formatTanggal(str) {
  const [y, m, d] = str.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatWaktu(str) {
  const [tgl, jam] = str.split(' ');
  return `${formatTanggal(tgl)}, ${jam || ''}`.replace(/, $/, '');
}

/* ---------- 2. Modal, alert, toast ---------- */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.hidden = false;
  document.body.classList.add('modal-open');
  const first = $('input, select, textarea', m) || $('button', m);
  if (first) first.focus();
}
function closeModal(m) {
  if (m.dataset.dynamic) m.remove();
  else m.hidden = true;
  if (!$('.modal:not([hidden])')) document.body.classList.remove('modal-open');
  if (typeof m._onClose === 'function') m._onClose();
}

/* Pop-up alert. type: info | error | success */
function showAlert(title, message, type = 'info', onClose) {
  const box = el('div', { class: `modal__box modal__box--${type}` },
    el('h2', { text: title }),
    el('p', { text: message }),
    el('button', { class: 'btn', type: 'button', 'data-close': '', text: 'Mengerti' }));
  const m = el('div', { class: 'modal', 'data-dynamic': '1', role: 'alertdialog', 'aria-modal': 'true', 'aria-label': title }, box);
  m._onClose = onClose;
  document.body.append(m);
  document.body.classList.add('modal-open');
  $('button', box).focus();
}

function toast(msg) {
  let t = $('#toast');
  if (!t) {
    t = el('div', { id: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('is-show'), 2200);
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open]');
  if (opener) { openModal(opener.dataset.open); return; }
  const closer = e.target.closest('[data-close]');
  if (closer) { closeModal(closer.closest('.modal')); return; }
  if (e.target.classList.contains('modal')) closeModal(e.target);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = $$('.modal:not([hidden])').pop();
  if (open) closeModal(open);
});

/* ---------- 3. Validasi form ---------- */
function fieldError(input, msg) {
  input.setAttribute('aria-invalid', 'true');
  const box = input.closest('.field');
  const err = box && $('.field__error', box);
  if (err) err.textContent = msg;
}
function clearErrors(form) {
  $$('[aria-invalid]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  $$('.field__error', form).forEach((e) => { e.textContent = ''; });
}

/* ---------- 4. Sesi, data bersama ---------- */
const getSession = () => load(KEY.session, null);
const getUsers = () => [...dataPengguna, ...load(KEY.users, [])];
const getOrders = () => load(KEY.orders, []);
const getCart = () => load(KEY.cart, []);
const saveCart = (c) => save(KEY.cart, c);
const getBooks = () => load(KEY.books, null) || dataKatalogBuku.map((b) => ({ ...b }));
const saveBooks = (b) => save(KEY.books, b);

function requireLogin() {
  if (getSession()) return true;
  location.replace('index.html');
  return false;
}
function initTopbar() {
  const s = getSession();
  const name = $('#user-name');
  if (name && s) name.textContent = s.nama;
  const out = $('#btn-logout');
  if (out) out.addEventListener('click', () => {
    localStorage.removeItem(KEY.session);
    location.href = 'index.html';
  });
}

function addToCart(kode, qty = 1) {
  const book = getBooks().find((b) => b.kodeBarang === kode);
  if (!book) return false;
  const cart = getCart();
  const item = cart.find((i) => i.kode === kode);
  const next = (item ? item.qty : 0) + qty;
  if (next > book.stok) {
    showAlert('Stok tidak cukup', `Stok "${book.namaBarang}" tinggal ${book.stok} eksemplar.`, 'error');
    return false;
  }
  if (item) item.qty = next; else cart.push({ kode, qty });
  saveCart(cart);
  return true;
}

/* =========================================================
   HALAMAN LOGIN (index.html)
   ========================================================= */
function initLogin() {
  const formLogin = $('#form-login');
  const formDaftar = $('#form-daftar');
  const formLupa = $('#form-lupa');

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(formLogin);
    const { email, password } = formLogin.elements;
    const emailVal = email.value.trim().toLowerCase();
    let ok = true;

    if (!emailVal) { fieldError(email, 'Email wajib diisi.'); ok = false; }
    else if (!EMAIL_RE.test(emailVal)) { fieldError(email, 'Format email belum benar. Contoh: nama@gmail.com'); ok = false; }
    if (!password.value) { fieldError(password, 'Password wajib diisi.'); ok = false; }
    if (!ok) return;

    const user = getUsers().find((u) => u.email.toLowerCase() === emailVal && u.password === password.value);
    if (!user) {
      showAlert('Login gagal', 'Email/password yang anda masukkan salah.', 'error');
      return;
    }
    save(KEY.session, { id: user.id, nama: user.nama, email: user.email, role: user.role });
    location.href = 'dashboard.html';
  });

  formDaftar.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(formDaftar);
    const { nama, email, password, konfirmasi } = formDaftar.elements;
    const emailVal = email.value.trim().toLowerCase();
    let ok = true;

    if (nama.value.trim().length < 3) { fieldError(nama, 'Nama minimal 3 karakter.'); ok = false; }
    if (!EMAIL_RE.test(emailVal)) { fieldError(email, 'Masukkan email yang valid.'); ok = false; }
    else if (getUsers().some((u) => u.email.toLowerCase() === emailVal)) { fieldError(email, 'Email ini sudah terdaftar. Silakan masuk.'); ok = false; }
    if (password.value.length < 6) { fieldError(password, 'Password minimal 6 karakter.'); ok = false; }
    if (konfirmasi.value !== password.value) { fieldError(konfirmasi, 'Konfirmasi password tidak sama.'); ok = false; }
    if (!ok) return;

    const users = load(KEY.users, []);
    users.push({ id: getUsers().length + 1, nama: nama.value.trim(), email: emailVal, password: password.value, role: 'User' });
    save(KEY.users, users);
    closeModal($('#modal-daftar'));
    formDaftar.reset();
    formLogin.elements.email.value = emailVal;
    showAlert('Pendaftaran berhasil', 'Akun sudah dibuat. Silakan masuk dengan email dan password tadi.', 'success');
  });

  formLupa.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(formLupa);
    const { email } = formLupa.elements;
    const emailVal = email.value.trim().toLowerCase();
    if (!EMAIL_RE.test(emailVal)) { fieldError(email, 'Masukkan email yang valid.'); return; }
    if (!getUsers().some((u) => u.email.toLowerCase() === emailVal)) {
      fieldError(email, 'Email ini belum terdaftar.');
      return;
    }
    closeModal($('#modal-lupa'));
    formLupa.reset();
    showAlert('Tautan terkirim', `Tautan reset password sudah dikirim ke ${emailVal}. (Simulasi)`, 'success');
  });
}

/* =========================================================
   DASHBOARD (dashboard.html)
   ========================================================= */
function sapaan(jam) {
  if (jam >= 4 && jam < 11) return 'pagi';
  if (jam >= 11 && jam < 15) return 'siang';
  if (jam >= 15 && jam < 18) return 'sore';
  return 'malam';
}

function initDashboard() {
  const s = getSession();
  const tick = () => {
    const d = new Date();
    $('#greeting').textContent = `Selamat ${sapaan(d.getHours())}, ${s.nama}.`;
    $('#clock').textContent = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      + ', pukul ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);

  const orders = getOrders();

  /* Laporan pemesanan: ringkasan + rekap per judul */
  const laporan = $('#laporan-body');
  if (!orders.length) {
    laporan.append(el('p', { class: 'empty-note', text: 'Belum ada pesanan. Pilih buku di halaman Katalog, lalu selesaikan di Checkout.' }));
  } else {
    const rekap = {};
    orders.forEach((o) => o.items.forEach((i) => {
      const r = rekap[i.kode] || (rekap[i.kode] = { nama: i.nama, qty: 0, total: 0 });
      r.qty += i.qty;
      r.total += i.harga * i.qty;
    }));
    const totalQty = Object.values(rekap).reduce((a, r) => a + r.qty, 0);
    const totalUang = orders.reduce((a, o) => a + o.totalAngka, 0);
    laporan.append(
      el('dl', { class: 'report-stats' },
        el('div', {}, el('dt', { text: 'Jumlah pesanan' }), el('dd', { text: String(orders.length) })),
        el('div', {}, el('dt', { text: 'Buku dipesan' }), el('dd', { text: `${totalQty} eksemplar` })),
        el('div', {}, el('dt', { text: 'Total pembayaran' }), el('dd', { text: rupiah(totalUang) }))),
      el('div', { class: 'table-wrap' },
        el('table', { class: 'data' },
          el('caption', { text: 'Rekap per judul buku' }),
          el('thead', {}, el('tr', {},
            el('th', { scope: 'col', text: 'Judul' }),
            el('th', { scope: 'col', class: 'num', text: 'Jumlah' }),
            el('th', { scope: 'col', class: 'num', text: 'Nilai' }))),
          el('tbody', {}, Object.values(rekap).map((r) => el('tr', {},
            el('td', { text: r.nama }),
            el('td', { class: 'num', text: String(r.qty) }),
            el('td', { class: 'num', text: rupiah(r.total) })))))));
  }

  /* History transaksi */
  const history = $('#history-body');
  if (!orders.length) {
    history.append(el('p', { class: 'empty-note', text: 'Belum ada transaksi.' }));
  } else {
    history.append(el('div', { class: 'table-wrap' },
      el('table', { class: 'data' },
        el('thead', {}, el('tr', {},
          el('th', { scope: 'col', text: 'Nomor DO' }),
          el('th', { scope: 'col', text: 'Tanggal' }),
          el('th', { scope: 'col', class: 'num', text: 'Item' }),
          el('th', { scope: 'col', class: 'num', text: 'Total' }),
          el('th', { scope: 'col', text: 'Status' }))),
        el('tbody', {}, [...orders].reverse().map((o) => el('tr', {},
          el('td', {}, el('a', { href: `tracking.html?do=${o.nomorDO}`, text: o.nomorDO })),
          el('td', { text: formatTanggal(o.tanggalKirim) }),
          el('td', { class: 'num', text: String(o.items.reduce((a, i) => a + i.qty, 0)) }),
          el('td', { class: 'num', text: o.total }),
          el('td', {}, el('span', { class: 'badge', text: o.status }))))))));
  }
}

/* =========================================================
   STOK / KATALOG (stok.html)
   ========================================================= */
function initStok() {
  let books = getBooks();
  const tbody = $('#tbody-stok');
  const search = $('#cari-buku');
  const form = $('#form-stok');

  function coverCell(b) {
    const ph = () => el('span', { class: 'cover-ph', 'aria-hidden': 'true', text: b.namaBarang.charAt(0) });
    if (!b.cover) return ph();
    const img = el('img', { class: 'cover', src: b.cover, alt: `Sampul ${b.namaBarang}`, loading: 'lazy' });
    img.addEventListener('error', () => img.replaceWith(ph()));
    return img;
  }

  function buildRow(b) {
    const low = b.stok < 200;
    return el('tr', {},
      el('td', {}, coverCell(b)),
      el('td', { text: b.kodeBarang }),
      el('td', {}, b.namaBarang, b.custom ? el('span', { class: 'tag-new', text: 'baru' }) : ''),
      el('td', { text: b.jenisBarang }),
      el('td', { text: `Edisi ${b.edisi}` }),
      el('td', { class: `num${low ? ' stock--low' : ''}`, text: b.stok.toLocaleString('id-ID') }),
      el('td', { class: 'num', text: b.harga }),
      el('td', {}, el('div', { class: 'actions' },
        el('button', {
          class: 'btn btn--sm', type: 'button', text: 'Pesan',
          ...(b.stok < 1 ? { disabled: '' } : {}),
          onclick: () => { if (addToCart(b.kodeBarang)) toast(`"${b.namaBarang}" masuk keranjang`); },
        }),
        b.custom ? el('button', {
          class: 'btn btn--sm btn--danger', type: 'button', text: 'Hapus',
          onclick: () => {
            if (!confirm(`Hapus "${b.namaBarang}" dari katalog?`)) return;
            books = books.filter((x) => x.kodeBarang !== b.kodeBarang);
            saveBooks(books);
            render();
          },
        }) : '')));
  }

  function render() {
    tbody.replaceChildren();
    const q = search.value.trim().toLowerCase();
    const list = books.filter((b) => !q || b.namaBarang.toLowerCase().includes(q) || b.kodeBarang.toLowerCase().includes(q));
    if (!list.length) {
      tbody.append(el('tr', {}, el('td', { colspan: '8', class: 'empty', text: 'Tidak ada buku yang cocok. Coba kata kunci lain.' })));
    }
    list.forEach((b) => tbody.append(buildRow(b)));
    $('#total-judul').textContent = books.length;
    $('#total-stok').textContent = books.reduce((a, b) => a + b.stok, 0).toLocaleString('id-ID');
  }

  search.addEventListener('input', render);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    const kode = f.kode.value.trim().toUpperCase();
    const nama = f.nama.value.trim();
    const edisi = Number(f.edisi.value);
    const stok = Number(f.stok.value);
    const harga = Number(f.harga.value);
    let ok = true;

    if (!/^[A-Z]{4}\d{4}$/.test(kode)) { fieldError(f.kode, 'Format: 4 huruf + 4 angka, contoh ASIP4301.'); ok = false; }
    else if (books.some((b) => b.kodeBarang === kode)) { fieldError(f.kode, 'Kode ini sudah ada di katalog.'); ok = false; }
    if (nama.length < 3) { fieldError(f.nama, 'Nama buku minimal 3 karakter.'); ok = false; }
    if (!Number.isInteger(edisi) || edisi < 1) { fieldError(f.edisi, 'Edisi minimal 1.'); ok = false; }
    if (f.stok.value === '' || !Number.isInteger(stok) || stok < 0) { fieldError(f.stok, 'Stok harus angka 0 atau lebih.'); ok = false; }
    if (!Number.isFinite(harga) || harga < 1000) { fieldError(f.harga, 'Harga minimal Rp 1.000.'); ok = false; }
    if (!ok) return;

    books.push({
      kodeBarang: kode, namaBarang: nama, jenisBarang: f.jenis.value,
      edisi: String(edisi), stok, harga: rupiah(harga), cover: '', custom: true,
    });
    saveBooks(books);
    render();
    form.reset();
    toast(`"${nama}" ditambahkan ke katalog`);
  });

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Kembalikan katalog ke data awal? Buku yang Anda tambahkan akan hilang.')) return;
    localStorage.removeItem(KEY.books);
    books = getBooks();
    render();
    toast('Katalog dikembalikan ke data awal');
  });

  render();
}

/* =========================================================
   CHECKOUT (checkout.html)
   ========================================================= */
function initCheckout() {
  const tbody = $('#tbody-cart');
  const form = $('#form-checkout');
  const pilih = $('#pilih-buku');
  const qtyBaru = $('#qty-baru');
  const s = getSession();

  form.elements.nama.value = s.nama;
  form.elements.email.value = s.email;

  function fillPilihan() {
    pilih.replaceChildren(el('option', { value: '', text: 'Pilih buku...' }));
    getBooks().filter((b) => b.stok > 0).forEach((b) => {
      pilih.append(el('option', { value: b.kodeBarang, text: `${b.namaBarang} (${b.harga})` }));
    });
  }

  function renderSummary(subtotal) {
    const ongkir = subtotal > 0 ? (ONGKIR[form.elements.ekspedisi.value] || 0) : 0;
    $('#sum-subtotal').textContent = rupiah(subtotal);
    $('#sum-ongkir').textContent = rupiah(ongkir);
    $('#sum-total').textContent = rupiah(subtotal + ongkir);
    return { subtotal, ongkir, total: subtotal + ongkir };
  }

  function cartTotals() {
    const books = getBooks();
    return getCart().reduce((a, i) => {
      const b = books.find((x) => x.kodeBarang === i.kode);
      return a + (b ? parseRupiah(b.harga) * i.qty : 0);
    }, 0);
  }

  function renderCart() {
    tbody.replaceChildren();
    const books = getBooks();
    const cart = getCart().filter((i) => books.some((b) => b.kodeBarang === i.kode));
    saveCart(cart);

    if (!cart.length) {
      tbody.append(el('tr', {}, el('td', { colspan: '5', class: 'empty', text: 'Keranjang kosong. Tambahkan buku lewat pilihan di bawah atau dari halaman Katalog.' })));
    }
    cart.forEach((item) => {
      const b = books.find((x) => x.kodeBarang === item.kode);
      const qty = el('input', {
        class: 'inline-input inline-input--qty', type: 'number', min: '1', max: String(b.stok),
        value: String(item.qty), 'aria-label': `Jumlah ${b.namaBarang}`,
      });
      qty.addEventListener('change', () => {
        let v = parseInt(qty.value, 10);
        if (!v || v < 1) v = 1;
        if (v > b.stok) {
          v = b.stok;
          showAlert('Stok tidak cukup', `Stok "${b.namaBarang}" tinggal ${b.stok} eksemplar.`, 'error');
        }
        item.qty = v;
        saveCart(cart);
        renderCart();
      });
      tbody.append(el('tr', {},
        el('td', { text: b.namaBarang }),
        el('td', { class: 'num', text: b.harga }),
        el('td', {}, qty),
        el('td', { class: 'num', text: rupiah(parseRupiah(b.harga) * item.qty) }),
        el('td', {}, el('button', {
          class: 'btn btn--sm btn--danger', type: 'button', text: 'Hapus',
          onclick: () => { saveCart(cart.filter((i) => i.kode !== item.kode)); renderCart(); },
        }))));
    });
    renderSummary(cartTotals());
  }

  $('#btn-tambah').addEventListener('click', () => {
    const qty = parseInt(qtyBaru.value, 10);
    if (!pilih.value) { showAlert('Buku belum dipilih', 'Pilih salah satu buku dari daftar dulu.', 'error'); return; }
    if (!qty || qty < 1) { showAlert('Jumlah tidak valid', 'Jumlah buku minimal 1.', 'error'); return; }
    if (addToCart(pilih.value, qty)) {
      renderCart();
      pilih.value = '';
      qtyBaru.value = 1;
    }
  });

  form.elements.ekspedisi.addEventListener('change', () => renderSummary(cartTotals()));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    const f = form.elements;
    let ok = true;

    if (f.nama.value.trim().length < 3) { fieldError(f.nama, 'Nama pemesan minimal 3 karakter.'); ok = false; }
    if (!EMAIL_RE.test(f.email.value.trim())) { fieldError(f.email, 'Masukkan email yang valid.'); ok = false; }
    if (!PHONE_RE.test(f.telepon.value.replace(/[\s-]/g, ''))) { fieldError(f.telepon, 'Nomor HP tidak valid. Contoh: 081234567890'); ok = false; }
    if (f.alamat.value.trim().length < 10) { fieldError(f.alamat, 'Alamat minimal 10 karakter agar kurir bisa menemukan Anda.'); ok = false; }
    if (!f.ekspedisi.value) { fieldError(f.ekspedisi, 'Pilih ekspedisi.'); ok = false; }
    if (!f.metode.value) { fieldError(f.metode, 'Pilih metode pembayaran.'); ok = false; }
    if (!ok) { showAlert('Data belum lengkap', 'Periksa isian yang bertanda merah, lalu coba lagi.', 'error'); return; }

    const cart = getCart();
    if (!cart.length) { showAlert('Keranjang kosong', 'Tambahkan minimal satu buku sebelum memesan.', 'error'); return; }

    const books = getBooks();
    for (const i of cart) {
      const b = books.find((x) => x.kodeBarang === i.kode);
      if (!b || i.qty > b.stok) {
        showAlert('Stok berubah', `Stok "${b ? b.namaBarang : i.kode}" tidak cukup. Ubah jumlahnya dulu.`, 'error');
        return;
      }
    }

    const items = cart.map((i) => {
      const b = books.find((x) => x.kodeBarang === i.kode);
      return { kode: b.kodeBarang, nama: b.namaBarang, qty: i.qty, harga: parseRupiah(b.harga) };
    });
    const subtotal = items.reduce((a, i) => a + i.harga * i.qty, 0);
    const total = subtotal + (ONGKIR[f.ekspedisi.value] || 0);

    const orders = getOrders();
    let nomorDO;
    do { nomorDO = String(new Date().getFullYear()) + String(Math.floor(1000 + Math.random() * 9000)); }
    while (orders.some((o) => o.nomorDO === nomorDO) || (typeof dataTracking !== 'undefined' && dataTracking[nomorDO]));

    orders.push({
      nomorDO, nama: f.nama.value.trim(), email: f.email.value.trim(), telepon: f.telepon.value.trim(),
      alamat: f.alamat.value.trim(), metode: f.metode.value,
      status: 'Diproses', ekspedisi: f.ekspedisi.value, tanggalKirim: todayISO(), paket: 'Reguler',
      total: rupiah(total), totalAngka: total, items,
      perjalanan: [{ waktu: nowStamp(), keterangan: 'Pesanan diterima. Menunggu pengemasan di gudang.' }],
    });
    save(KEY.orders, orders);

    items.forEach((i) => { books.find((b) => b.kodeBarang === i.kode).stok -= i.qty; });
    saveBooks(books);
    saveCart([]);

    $('#sukses-do').textContent = nomorDO;
    $('#sukses-total').textContent = rupiah(total);
    $('#sukses-link').href = `tracking.html?do=${nomorDO}`;
    form.reset();
    f.nama.value = s.nama;
    f.email.value = s.email;
    fillPilihan();
    renderCart();
    openModal('modal-sukses');
  });

  fillPilihan();
  renderCart();
}

/* =========================================================
   TRACKING (tracking.html)
   ========================================================= */
function initTracking() {
  const form = $('#form-tracking');
  const hasil = $('#hasil');
  const input = form.elements.nomor;

  function cari(nomor) {
    return dataTracking[nomor] || getOrders().find((o) => o.nomorDO === nomor) || null;
  }

  function tampilkan(data) {
    const trip = data.perjalanan || [];
    const last = trip[trip.length - 1];
    /* Jika catatan terakhir "Selesai Antar", anggap paket sudah diterima. */
    const status = last && /^selesai antar/i.test(last.keterangan) ? 'Diterima' : data.status;
    let idx = STEPS.indexOf(status);
    if (idx < 0) idx = 0;
    const selesai = idx === STEPS.length - 1;

    $('#r-nama').textContent = data.nama;
    const badge = $('#r-status');
    badge.textContent = status;
    badge.className = selesai ? 'badge badge--done' : 'badge';

    const bar = $('#r-bar');
    bar.classList.toggle('is-done', selesai);
    bar.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = `${((idx + 1) / STEPS.length) * 100}%`; }));
    $('#r-progress').setAttribute('aria-valuenow', String(Math.round(((idx + 1) / STEPS.length) * 100)));

    const steps = $('#r-steps');
    steps.replaceChildren();
    STEPS.forEach((label, i) => {
      steps.append(el('li', { class: i < idx ? 'is-done' : i === idx ? 'is-current is-done' : '', text: label, ...(i === idx ? { 'aria-current': 'step' } : {}) }));
    });

    $('#r-ekspedisi').textContent = data.ekspedisi;
    $('#r-tanggal').textContent = formatTanggal(data.tanggalKirim);
    $('#r-paket').textContent = data.paket;
    $('#r-total').textContent = data.total;

    const tl = $('#r-timeline');
    tl.replaceChildren();
    [...trip].reverse().forEach((t) => {
      tl.append(el('li', {}, el('time', { text: formatWaktu(t.waktu) }), t.keterangan));
    });
    hasil.hidden = false;
  }

  function submit() {
    clearErrors(form);
    const nomor = input.value.trim();
    hasil.hidden = true;
    if (!nomor) { fieldError(input, 'Nomor Delivery Order wajib diisi.'); return; }
    if (!/^\d{6,12}$/.test(nomor)) { fieldError(input, 'Nomor DO berupa angka 6 sampai 12 digit. Contoh: 20230012'); return; }
    const data = cari(nomor);
    if (!data) {
      showAlert('Nomor tidak ditemukan', `Tidak ada pengiriman dengan nomor DO ${nomor}. Periksa lagi nomornya.`, 'error');
      return;
    }
    tampilkan(data);
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });

  const prefill = new URLSearchParams(location.search).get('do');
  if (prefill) { input.value = prefill; submit(); }
}

/* =========================================================
   Router halaman
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page !== 'login') {
    if (!requireLogin()) return;
    initTopbar();
  }
  const routes = { login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking };
  if (routes[page]) routes[page]();
});
