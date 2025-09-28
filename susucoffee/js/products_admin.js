// js/products_admin.js

(function() {
    'use strict';
    
    if (document.body.dataset.page !== 'products_admin') return;

    const root = document.getElementById('adminRoot');
    if (!root) return;

    // --- Utils ---
    const storageGet = () => JSON.parse(localStorage.getItem('qn_products') || 'null') || [];
    const storageSet = (v) => localStorage.setItem('qn_products', JSON.stringify(v));
    const escapeHtml = (s) => (s + '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
    const fileToDataURL = (file) => new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image')) {
            return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    
    // --- UI & Rendering ---
    function render() {
        const list = storageGet();
        const productListEl = root.querySelector('#productsList');
        
        // Sửa lỗi ở đây: Kiểm tra xem productListEl có tồn tại không
        if (!productListEl) {
            console.error('Không tìm thấy #productsList để render.');
            return;
        }

        if (!list || list.length === 0) {
            productListEl.innerHTML = '<div class="small">Không có sản phẩm nào.</div>';
            return;
        }

        productListEl.innerHTML = list.map(p => `
            <div class="product-admin-item" data-id="${p.id}">
                <div class="img" style="background-image:url('${p.img || ''}');"></div>
                <div class="product-info">
                    <div class="product-name">${escapeHtml(p.name)}</div>
                    <div class="product-price">${(p.price || 0).toLocaleString('vi-VN')} đ</div>
                </div>
                <div class="product-actions">
                    <button class="btn-primary edit" data-id="${p.id}">Sửa</button>
                    <button class="btn-danger delete" data-id="${p.id}">Xóa</button>
                </div>
            </div>`).join('');
            
        // Gắn lại sự kiện sau mỗi lần render
        productListEl.querySelectorAll('.edit').forEach(b => b.addEventListener('click', () => openEditModal(Number(b.dataset.id))));
        productListEl.querySelectorAll('.delete').forEach(b => b.addEventListener('click', () => {
            const id = Number(b.dataset.id);
            if (!confirm(`Bạn có chắc muốn xóa món ăn có ID ${id}?`)) return;
            const newList = storageGet().filter(x => x.id !== id);
            storageSet(newList);
            render(); // Render lại danh sách
        }));
    }

    function createAdminPanel() {
        // Tạo cấu trúc HTML ban đầu một lần duy nhất
        root.innerHTML = `
            <div class="admin-panel card">
                <h3>Quản lý món</h3>
                <form id="adminAddForm" class="admin-form">
                    <input name="name" placeholder="Tên món" required />
                    <input name="price" type="number" placeholder="Giá (VNĐ)" required />
                    <input name="imageFile" type="file" accept="image/*" />
                    <div class="form-actions">
                        <button class="btn-primary" type="submit">Thêm món</button>
                        <button id="resetDefaultsBtn" type="button" class="btn-secondary">Reset về mặc định</button>
                    </div>
                </form>
                <hr/>
                <div id="productsList" class="products-admin-list"></div>
            </div>`;
    }
    
    function openEditModal(id) {
        const list = storageGet();
        const p = list.find(x => x.id === id);
        if (!p) return alert('Không tìm thấy sản phẩm!');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Sửa món ID ${p.id}</h3>
                <form id="editForm">
                    <label>Tên món</label>
                    <input name="name" value="${escapeHtml(p.name)}" required />
                    <label>Giá</label>
                    <input name="price" type="number" value="${p.price}" required />
                    <label>Tải ảnh mới (tùy chọn)</label>
                    <input name="imageFile" type="file" accept="image/*" />
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" id="cancelBtn">Hủy</button>
                        <button type="submit" class="btn-primary">Lưu</button>
                    </div>
                </form>
            </div>`;
        document.body.appendChild(modal);

        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
        modal.querySelector('#cancelBtn').addEventListener('click', () => modal.remove());
        modal.querySelector('#editForm').addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;
            const newImgData = await fileToDataURL(form.imageFile.files[0]);

            const updatedProduct = {
                ...p,
                name: form.name.value.trim(),
                price: Number(form.price.value),
                img: newImgData || p.img
            };
            const newList = list.map(item => item.id === id ? updatedProduct : item);
            storageSet(newList);
            modal.remove();
            render();
        });
    }

    // --- Event Handlers ---
    async function handleAddSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        const price = Number(form.price.value);
        const imageFile = form.imageFile.files[0];

        if (!name || price <= 0) {
            alert('Vui lòng nhập tên và giá hợp lệ.');
            return;
        }

        const imgData = await fileToDataURL(imageFile);
        const list = storageGet();
        const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
        const newItem = { id: newId, name, price, img: imgData || '' };

        list.push(newItem);
        storageSet(list);
        form.reset();
        render(); // Chỉ cần render lại danh sách là đủ
    }

    function handleResetDefaults() {
        if (confirm('Bạn có chắc muốn xóa tất cả các thay đổi và quay về danh sách món mặc định?')) {
            // Lấy dữ liệu từ file JSON được cung cấp
            fetch('generated_products.json')
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(defaultProducts => {
                    storageSet(defaultProducts);
                    render();
                }).catch(err => {
                    alert('Không thể tải lại dữ liệu mặc định. Vui lòng kiểm tra file generated_products.json.');
                    console.error('Lỗi khi fetch generated_products.json:', err);
                });
        }
    }
    
    // --- Initialization ---
    function init() {
        createAdminPanel(); // Tạo giao diện
        render(); // Render danh sách lần đầu
        // Gắn sự kiện vào các element vừa tạo
        root.querySelector('#adminAddForm').addEventListener('submit', handleAddSubmit);
        root.querySelector('#resetDefaultsBtn').addEventListener('click', handleResetDefaults);
    }
    
    init();

})();