// js/app.js

(function () {
  'use strict';

  // --- SIDEBAR LOADER (Tải sidebar động) ---
  function renderSidebar(currentPage) {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    // Chuẩn hóa tên trang để so sánh
    const pageKey = currentPage.replace('_admin', '');

    const sidebarHTML = `
      <div class="brand">
        <div class="logo"><img data-icon="logo" src="images/logo/Susu.svg" alt="logo"></div>
        <div><strong>Susu Coffee</strong><div class="small">Nhân viên</div></div>
      </div>
      <div style="margin-top:12px"></div>
      <div class="nav">
        <a href="home.html" class="${currentPage === 'home' ? 'active' : ''}">
            <img class="icon" src="images/icon/home.svg" alt="home"> Trang chủ
        </a>
        <a href="staff.html" class="${currentPage === 'staff' ? 'active' : ''}">
            <img class="icon" src="images/icon/people.svg" alt="people"> Quản lý nhân viên
        </a>
        <a href="products.html" class="${pageKey === 'products' ? 'active' : ''}">
            <img class="icon" src="images/icon/bill.svg" alt="bill"> Danh sách món
        </a>
        <a href="products_admin.html" class="${currentPage === 'products_admin' ? 'active' : ''}">
            <img class="icon" src="images/icon/products.svg" alt="manage"> Quản lý món
        </a>
        <a href="seats.html" class="${currentPage === 'seats' ? 'active' : ''}">
            <img class="icon" src="images/icon/seat.svg" alt="seat"> Quản lý chỗ ngồi
        </a>
        <a href="login.html" style="color:var(--danger)">
            <img class="icon" src="images/icon/logout.svg" alt="logout"> Đăng xuất
        </a>
      </div>
    `;
    sidebarPlaceholder.innerHTML = sidebarHTML;
  }

  // --- UTILS (Hàm tiện ích dùng chung) ---
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => document.querySelectorAll(s);
  const storage = (key, value) => {
    if (value === undefined) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    }
    localStorage.setItem(key, JSON.stringify(value));
  };
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str).replace(/[&<>"'`=\/]/g, s => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
    }[s]));
  };

  // --- DEFAULT DATA (Dữ liệu mặc định) ---
  const DEFAULT_PRODUCTS = [
    {"id": 1, "name": "Americano", "price": 35000, "img": "images/list_drink/coffee/americano.png"},
    {"id": 2, "name": "Black Coffee", "price": 35000, "img": "images/list_drink/coffee/black_coffee.png"},
    {"id": 3, "name": "Cafe Muoi", "price": 35000, "img": "images/list_drink/coffee/cafe_muoi.png"},
    {"id": 4, "name": "Cafe Sua", "price": 35000, "img": "images/list_drink/coffee/cafe_sua.png"},
    {"id": 5, "name": "Capuchino", "price": 35000, "img": "images/list_drink/coffee/capuchino.png"},
    {"id": 6, "name": "Matcha Latte", "price": 35000, "img": "images/list_drink/coffee/matcha_latte.png"},
    {"id": 7, "name": "Sua Tuoi Cafe", "price": 35000, "img": "images/list_drink/coffee/sua_tuoi_cafe.png"},
    {"id": 8, "name": "Ep Ca Rot", "price": 35000, "img": "images/list_drink/juice/ep_ca_rot.png"},
    {"id": 9, "name": "Nuoc Ep Cam", "price": 35000, "img": "images/list_drink/juice/nuoc_ep_cam.png"},
    {"id": 10, "name": "Nuoc Ep Oi", "price": 35000, "img": "images/list_drink/juice/nuoc_ep_oi.png"},
    {"id": 11, "name": "Nuoc Ep Tao", "price": 35000, "img": "images/list_drink/juice/nuoc_ep_tao.png"},
    {"id": 12, "name": "Nuoc Ep Thom", "price": 35000, "img": "images/list_drink/juice/nuoc_ep_thom.png"},
    {"id": 13, "name": "Sua Tuoi Tran Chau Duong Den", "price": 35000, "img": "images/list_drink/milktea/sua_tuoi_tran_chau_duong_den.png"},
    {"id": 14, "name": "Tra Sua Tran Chau Duong Den", "price": 35000, "img": "images/list_drink/milktea/tra_sua_tran_chau_duong_den.png"},
    {"id": 15, "name": "Soda Chanh", "price": 35000, "img": "images/list_drink/soda/soda_chanh.png"},
    {"id": 16, "name": "Soda Dau", "price": 35000, "img": "images/list_drink/soda/soda_dau.png"},
    {"id": 17, "name": "Soda Tao Xanh Bac Ha", "price": 35000, "img": "images/list_drink/soda/soda_tao_xanh_bac_ha.png"},
    {"id": 18, "name": "Soda Viet Quat", "price": 35000, "img": "images/list_drink/soda/soda_viet_quat.png"},
    {"id": 19, "name": "Cherry Long Nhan", "price": 35000, "img": "images/list_drink/tea/cherry_long_nhan.png"},
    {"id": 20, "name": "Lipton Xi Muoi", "price": 35000, "img": "images/list_drink/tea/lipton_xi_muoi.png"},
    {"id": 21, "name": "Luc Tra Machiato", "price": 35000, "img": "images/list_drink/tea/luc_tra_machiato.png"},
    {"id": 22, "name": "Nuoc Chanh", "price": 35000, "img": "images/list_drink/tea/nuoc_chanh.png"},
    {"id": 23, "name": "Tra Dao Cam Sa", "price": 35000, "img": "images/list_drink/tea/tra_dao_cam_sa.png"},
    {"id": 24, "name": "Tra Den Machiato", "price": 35000, "img": "images/list_drink/tea/tra_den_machiato.png"},
    {"id": 25, "name": "Tra Gung Mat Ong", "price": 35000, "img": "images/list_drink/tea/tra_gung_mat_ong.png"},
    {"id": 26, "name": "Tra Lipton Chanh", "price": 35000, "img": "images/list_drink/tea/tra_lipton_chanh.png"},
    {"id": 27, "name": "Tra Lipton Thao Moc", "price": 35000, "img": "images/list_drink/tea/tra_lipton_thao_moc.png"},
    {"id": 28, "name": "Tra Oi Hong Dau Tay", "price": 35000, "img": "images/list_drink/tea/tra_oi_hong_dau_tay.png"},
    {"id": 29, "name": "Tra Sen Vang", "price": 35000, "img": "images/list_drink/tea/tra_sen_vang.png"},
    {"id": 30, "name": "Tra Vai Bac Ha", "price": 35000, "img": "images/list_drink/tea/tra_vai_bac_ha.png"}
  ];
  const SEATS_COUNT = 12;

  // --- DATA INITIALIZATION (Khởi tạo dữ liệu ban đầu) ---
  function initData() {
    if (!storage('qn_products')) {
      storage('qn_products', DEFAULT_PRODUCTS);
    }
    if (!storage('qn_seats')) {
      const seats = Array.from({ length: SEATS_COUNT }, (_, i) => ({
        id: i + 1,
        name: `Bàn ${i + 1}`,
        occupied: false,
        people: 0,
        startAt: null,
        orders: []
      }));
      storage('qn_seats', seats);
    }
    if (!storage('qn_staff')) {
      storage('qn_staff', []);
    }
    if (!storage('qn_activity')) {
        storage('qn_activity', []);
    }
  }

  // --- GLOBAL FUNCTIONS (Các hàm chung) ---
  function addActivity(text) {
    const act = storage('qn_activity');
    act.unshift({ t: Date.now(), text });
    storage('qn_activity', act.slice(0, 20));
  }

  function renderActivity() {
    const el = qs('#activity');
    if (!el) return;
    const act = storage('qn_activity');
    el.innerHTML = act.length ? act.map(a => `<div>${new Date(a.t).toLocaleString()} — <b>${a.text}</b></div>`).join('') : 'Không có hoạt động';
  }

  function updateStats() {
    const s = qs('#statStaff');
    if (s) s.textContent = (storage('qn_staff') || []).length;
    const se = qs('#statSeats');
    if (se) se.textContent = (storage('qn_seats') || []).length;
    const p = qs('#statProducts');
    if (p) p.textContent = (storage('qn_products') || []).length;
  }

  setInterval(() => {
    const el = qs('#timeNow');
    if (el) el.textContent = new Date().toLocaleString();
  }, 1000);

  // --- PAGE-SPECIFIC LOGIC (Logic cho từng trang) ---

  // Trang Đăng nhập
  function handleLoginPage() {
    const loginForm = qs('#loginForm');
    const demoBtn = qs('#demoBtn');
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const u = qs('#username').value.trim();
        const p = qs('#password').value.trim();
        if ((u === 'staff' && p === '1234') || (u && p)) { // Simple validation
          addActivity('Đăng nhập: ' + u);
          location.href = 'home.html';
        } else {
          alert('Sai tài khoản hoặc mật khẩu');
        }
      });
      demoBtn && demoBtn.addEventListener('click', () => {
        qs('#username').value = 'staff';
        qs('#password').value = '1234';
        loginForm.dispatchEvent(new Event('submit'));
      });
    }
  }

  // Trang Chủ
  function handleHomePage() {
    updateStats();
    renderActivity();
  }

  // Trang Nhân viên
    function handleStaffPage() {
      let editingStaffId = null;

      function renderStaff() {
        const list = storage('qn_staff') || [];
        const tbody = qs('#staffTable tbody');
        if (!tbody) return;
        tbody.innerHTML = list.map(s => {
          const totalSalary = (s.salary || 0) - (s.penalty || 0);
          // Định dạng ca làm từ giờ bắt đầu và kết thúc
          const shiftTime = (s.startTime && s.endTime) ? `${s.startTime} - ${s.endTime}` : '';
          
          return `
          <tr data-id="${s.id}">
            <td>${escapeHtml(s.name)}</td>
            <td>${shiftTime}</td>
            <td>${(s.salary || 0).toLocaleString('vi-VN')} đ</td>
            <td>${(s.penalty || 0).toLocaleString('vi-VN')} đ</td>
            <td><b>${totalSalary.toLocaleString('vi-VN')} đ</b></td>
            <td>
              <button class="edit" data-id="${s.id}">Sửa</button> 
              <button class="del" data-id="${s.id}">Xóa</button>
            </td>
          </tr>`;
        }).join('');

        // Gán sự kiện cho các nút Sửa
        qsa('#staffTable .edit').forEach(b => b.addEventListener('click', () => {
          const id = Number(b.dataset.id);
          const st = (storage('qn_staff') || []).find(x => x.id === id);
          if (st) {
            editingStaffId = id;
            qs('#st_name').value = st.name;
            qs('#st_startTime').value = st.startTime || '';
            qs('#st_endTime').value = st.endTime || '';
            qs('#st_salary').value = st.salary || '';
            qs('#st_penalty').value = st.penalty || '';
          }
        }));

        // Gán sự kiện cho các nút Xóa
        qsa('#staffTable .del').forEach(b => b.addEventListener('click', () => {
          if (!confirm('Xác nhận xóa nhân viên này?')) return;
          const id = Number(b.dataset.id);
          const arr = (storage('qn_staff') || []).filter(x => x.id !== id);
          storage('qn_staff', arr);
          renderStaff();
          addActivity('Xóa nhân viên #' + id);
        }));
      }

      // Xử lý sự kiện submit form
      qs('#staffForm').addEventListener('submit', e => {
        e.preventDefault();
        const name = qs('#st_name').value.trim();
        const startTime = qs('#st_startTime').value;
        const endTime = qs('#st_endTime').value;
        const salary = Number(qs('#st_salary').value || 0);
        const penalty = Number(qs('#st_penalty').value || 0);
        let arr = storage('qn_staff') || [];

        if (editingStaffId) { // Chế độ sửa
          arr = arr.map(s => s.id === editingStaffId ? { ...s, name, startTime, endTime, salary, penalty } : s);
          addActivity(`Sửa nhân viên ${name}`);
        } else { // Chế độ thêm mới
          const id = Date.now();
          arr.push({ id, name, startTime, endTime, salary, penalty });
          addActivity(`Thêm nhân viên ${name}`);
        }
        storage('qn_staff', arr);
        editingStaffId = null;
        e.target.reset(); // Xóa trống form
        renderStaff(); // Cập nhật lại bảng
        updateStats();
      });

      // Sự kiện cho nút Hủy
      qs('#staffReset').addEventListener('click', () => {
        editingStaffId = null;
        qs('#staffForm').reset();
      });

      // Chạy lần đầu để hiển thị dữ liệu
      renderStaff();
      updateStats();
    }
  
  // Trang Danh sách món (chọn món)
    function handleProductsPage() {
      let cart = [];

      function renderProducts() {
        const list = storage('qn_products') || [];
        const root = qs('#productsList');
        if (!root) return;

        if (!list.length) {
            root.innerHTML = '<div class="small">Không có sản phẩm nào. Vui lòng thêm ở trang Quản lý món.</div>';
            return;
        }
        
        root.innerHTML = list.map(p => `
          <div class="product-card">
            <div class="product-card-img" style="background-image:url('${p.img || ''}');"></div>
            <div class="product-card-info">
              <div class="product-card-name">${escapeHtml(p.name)}</div>
              <div class="product-card-footer">
                  <div class="product-card-price">${(p.price || 0).toLocaleString('vi-VN')} đ</div>
                  <button data-id="${p.id}" class="btn-primary add">Thêm</button>
              </div>
            </div>
          </div>`).join('');

        qsa('.add').forEach(b => b.addEventListener('click', () => {
          const id = Number(b.dataset.id);
          const p = list.find(x => x.id === id);
          if (!p) return;
          const exist = cart.find(c => c.id === p.id);
          if (exist) {
            exist.qty++;
          } else {
            cart.push({ ...p, qty: 1 });
          }
          renderCart();
        }));
      }
      
      function renderCart() {
          const container = qs('#cartItems');
          const totalEl = qs('#cartTotal');
          if (!container || !totalEl) return;

          if (cart.length === 0) {
              container.innerHTML = '<div class="small">Giỏ hàng trống</div>';
          } else {
              container.innerHTML = cart.map(it => `
              <div class="cart-item">
                  <div>
                      <div>${escapeHtml(it.name)} <small>x${it.qty}</small></div>
                      <div class="small">${(it.price * it.qty).toLocaleString('vi-VN')} đ</div>
                  </div>
                  <div>
                      <button class="minus" data-id="${it.id}">-</button> 
                      <button class="plus" data-id="${it.id}">+</button> 
                      <button class="rm" data-id="${it.id}">x</button>
                  </div>
              </div>`).join('');
          }

          qsa('#cartItems .plus').forEach(b => b.addEventListener('click', () => {
              const id = Number(b.dataset.id);
              const item = cart.find(x => x.id === id);
              if (item) item.qty++;
              renderCart();
          }));
          qsa('#cartItems .minus').forEach(b => b.addEventListener('click', () => {
              const id = Number(b.dataset.id);
              const item = cart.find(x => x.id === id);
              if (item) {
                  item.qty--;
                  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
              }
              renderCart();
          }));
          qsa('#cartItems .rm').forEach(b => b.addEventListener('click', () => {
              const id = Number(b.dataset.id);
              cart = cart.filter(x => x.id !== id);
              renderCart();
          }));

          const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
          totalEl.textContent = total.toLocaleString('vi-VN') + ' đ';
      }

      function showSeatSelectionModal() {
          const seats = storage('qn_seats') || [];
          const modal = document.createElement('div');
          modal.className = 'modal';
          
          const options = seats.map(s => {
              const status = s.occupied ? ' (Đang phục vụ)' : ' (Trống)';
              const disabled = s.occupied ? 'disabled' : '';
              return `<option value="${s.id}" ${disabled}>${s.name}${status}</option>`;
          }).join('');

          modal.innerHTML = `
              <div class="modal-content">
                  <h3>Chọn bàn để gán</h3>
                  <form id="seatAssignForm">
                      <select name="seat" required style="width:100%; padding: 8px; font-size: 16px;">
                          <option value="">-- Vui lòng chọn bàn --</option>
                          ${options}
                      </select>
                      <div class="form-actions">
                          <button type="button" class="btn-secondary" id="cancelAssignBtn">Hủy</button>
                          <button type="submit" class="btn-primary">Xác nhận</button>
                      </div>
                  </form>
              </div>`;
          
          document.body.appendChild(modal);

          modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
          modal.querySelector('#cancelAssignBtn').addEventListener('click', () => modal.remove());
          modal.querySelector('#seatAssignForm').addEventListener('submit', e => {
              e.preventDefault();
              const seatId = Number(e.target.seat.value);
              if (!seatId) {
                  alert('Vui lòng chọn một bàn.');
                  return;
              }

              const allSeats = storage('qn_seats');
              const updatedSeats = allSeats.map(s => {
                  if (s.id === seatId) {
                      return {
                          ...s,
                          occupied: true,
                          startAt: Date.now(),
                          orders: cart.map(c => ({ id: c.id, name: c.name, qty: c.qty, price: c.price }))
                      };
                  }
                  return s;
              });
              storage('qn_seats', updatedSeats);
              addActivity(`Gán giỏ hàng cho Bàn ${seatId}`);
              cart = [];
              renderCart();
              modal.remove();
              alert(`Đã gán giỏ hàng cho Bàn ${seatId}. Chuyển đến trang quản lý bàn.`);
              location.href = 'seats.html';
          });
      }

      qs('#printBillBtn').addEventListener('click', () => {
          if (cart.length === 0) return alert('Giỏ hàng trống');
          const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
          const html = `<html><head><meta charset="utf-8"><title>Hóa Đơn</title><style>body{font-family:sans-serif;}</style></head><body><h2>HÓA ĐƠN</h2><div>${new Date().toLocaleString()}</div><hr>${cart.map(it => `<div>${escapeHtml(it.name)} x${it.qty} — ${(it.price * it.qty).toLocaleString('vi-VN')} đ</div>`).join('')}<hr><h3>Tổng: ${total.toLocaleString('vi-VN')} đ</h3></body></html>`;
          const w = window.open('', '_blank');
          w.document.write(html);
          w.document.close();
          w.print();
          addActivity(`Xuất bill (khách lẻ) ${total.toLocaleString('vi-VN')} đ`);
      });

      qs('#assignSeatBtn').addEventListener('click', () => {
          if (cart.length === 0) return alert('Giỏ hàng trống');
          const seats = storage('qn_seats');
          if (!seats.some(s => !s.occupied)) return alert('Tất cả các bàn đều đang được phục vụ!');
          
          showSeatSelectionModal(); // Hiển thị modal chọn bàn
      });

      renderProducts();
      renderCart();
    }

  // === QUẢN LÝ CHỖ NGỒI ===
    function handleSeatsPage() {
      let selectedSeatId = null; // Biến để lưu ID của bàn đang được chọn

      // --- Hàm render chi tiết bàn bên phải ---
      function renderSeatDetails(seatId) {
        const panel = qs('#seatDetailsPanel');
        const seats = storage('qn_seats') || [];
        const seat = seats.find(s => s.id === seatId);

        if (!seat) {
          panel.innerHTML = `<div class="placeholder">Chọn một bàn để xem chi tiết.</div>`;
          selectedSeatId = null;
          renderSeats(); // Cập nhật lại grid để bỏ highlight
          return;
        }

        let ordersHtml = '<div class="small">Chưa có món nào.</div>';
        let total = 0;
        if (seat.occupied && seat.orders && seat.orders.length > 0) {
          total = seat.orders.reduce((sum, item) => sum + item.price * item.qty, 0);
          ordersHtml = `
            <table class="order-table">
              ${seat.orders.map(item => `
                <tr>
                  <td>${escapeHtml(item.name)}</td>
                  <td style="white-space:nowrap">x ${item.qty}</td>
                  <td style="text-align:right; white-space:nowrap;">${(item.price * item.qty).toLocaleString('vi-VN')} đ</td>
                </tr>
              `).join('')}
            </table>
          `;
        }

        const startTime = seat.startAt ? new Date(seat.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        panel.innerHTML = `
          <div class="seat-details-header">
            <h3>${escapeHtml(seat.name)}</h3>
            <span class="status ${seat.occupied ? 'occupied' : 'available'}">
              ${seat.occupied ? 'Đang có khách' : 'Còn trống'}
            </span>
          </div>
          ${seat.occupied ? `<div class="small" style="margin-top:-8px; margin-bottom: 12px;">Bắt đầu lúc: <strong>${startTime}</strong></div>` : ''}
          
          <div class="seat-details-body">
            <h4>Các món đã gọi</h4>
            <div class="order-list">${ordersHtml}</div>
            ${seat.occupied ? `
              <div class="order-total">
                <span>Tổng cộng</span>
                <strong>${total.toLocaleString('vi-VN')} đ</strong>
              </div>` : ''
            }
          </div>
          
          <div class="seat-details-actions">
            ${!seat.occupied ? `
              <button id="action-open-seat" class="btn-primary full">Mở bàn</button>
            ` : `
              <button id="action-add-item" class="btn-primary">Thêm món</button>
              <button id="action-pay" class="btn-secondary">Thanh toán</button>
            `}
          </div>
        `;

        // --- Gán sự kiện cho các nút trong panel ---
        const btnOpen = panel.querySelector('#action-open-seat');
        if (btnOpen) {
          btnOpen.addEventListener('click', () => {
            if (confirm(`Bạn có chắc muốn mở ${seat.name}?`)) {
              const now = new Date();
              seat.occupied = true;
              seat.startAt = now.toISOString();
              storage('qn_seats', seats);
              addActivity(`Mở ${seat.name} lúc ${now.toLocaleTimeString('vi-VN')}`);
              renderSeats();
              renderSeatDetails(seat.id);
            }
          });
        }

        const btnAdd = panel.querySelector('#action-add-item');
        if (btnAdd) {
          btnAdd.addEventListener('click', () => {
            sessionStorage.setItem('qn_assignToSeat', seat.id);
            window.location.href = 'products.html';
          });
        }
        
        const btnPay = panel.querySelector('#action-pay');
        if (btnPay) {
          btnPay.addEventListener('click', () => {
            if (!seat.orders || seat.orders.length === 0) {
              if (confirm(`Bàn này chưa có món nào. Bạn có muốn đóng bàn không?`)) {
                seat.occupied = false;
                seat.startAt = null;
                seat.orders = [];
                storage('qn_seats', seats);
                addActivity(`Đóng ${seat.name} (trống)`);
                renderSeats();
                renderSeatDetails(seat.id);
              }
              return;
            }

            if (confirm(`Thanh toán và đóng ${seat.name}?\nTổng cộng: ${total.toLocaleString('vi-VN')} đ.`)) {
              const html = `<html><head><meta charset="utf-8"><title>Hóa đơn ${seat.name}</title><style>body{font-family:monospace; margin: 0; padding: 10px; font-size: 14px;} h2,h3{margin:5px 0} table{width:100%; border-collapse:collapse} td{padding:3px 0}</style></head><body><h2>HÓA ĐƠN - ${seat.name}</h2><div>${new Date().toLocaleString()}</div><hr>${seat.orders.map(it=>`<div>${it.name}<br/>${it.qty} x ${it.price.toLocaleString('vi-VN')} = <strong>${(it.price*it.qty).toLocaleString('vi-VN')} đ</strong></div>`).join('<br/>')}<hr><h3>Tổng: ${total.toLocaleString('vi-VN')} đ</h3></body></html>`;
              const w = window.open('', '_blank');
              w.document.write(html);
              w.document.close();
              w.print();

              seat.occupied = false;
              seat.startAt = null;
              seat.orders = [];
              storage('qn_seats', seats);
              addActivity(`Thanh toán ${seat.name} — ${total.toLocaleString('vi-VN')} đ`);
              renderSeats();
              renderSeatDetails(seat.id);
            }
          });
        }
      }

      // --- Hàm render lưới các bàn (thêm class 'active') ---
      function renderSeats() {
        const seats = storage('qn_seats') || [];
        const el = qs('#seatsGrid');
        if (!el) return;
        el.innerHTML = seats.map(s => {
          let className = 'seat';
          if (s.occupied) className += ' occupied';
          if (s.id === selectedSeatId) className += ' active'; // Thêm class active
          return `<div class="${className}" data-id="${s.id}">${s.name}</div>`;
        }).join('');
      }

      // --- Gán sự kiện click cho lưới các bàn ---
      qs('#seatsGrid').addEventListener('click', (e) => {
        const seatEl = e.target.closest('.seat');
        if (seatEl) {
          const id = Number(seatEl.dataset.id);
          selectedSeatId = id; // Cập nhật bàn đang chọn
          renderSeats(); // Vẽ lại lưới để highlight bàn được chọn
          renderSeatDetails(id); // Hiển thị chi tiết của bàn đó
        }
      });

      // --- Chạy lần đầu khi tải trang ---
      renderSeats();
      renderSeatDetails(null); // Hiển thị placeholder ban đầu
    }

  // --- MAIN EXECUTION (Chạy code chính) ---
  document.addEventListener('DOMContentLoaded', () => {
    initData(); // Luôn khởi tạo dữ liệu trước

    const page = document.body.dataset.page;

    // Render sidebar cho các trang cần thiết
    if (page && page !== 'login') {
      renderSidebar(page);
    }
    
    switch (page) {
      case 'login':
        handleLoginPage();
        break;
      case 'home':
        handleHomePage();
        break;
      case 'staff':
        handleStaffPage();
        break;
      case 'products':
        handleProductsPage();
        break;
      case 'seats':
        handleSeatsPage();
        break;
    }
  });

})();