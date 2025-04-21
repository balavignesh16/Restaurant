document.addEventListener('DOMContentLoaded', () => {
  // Existing smooth scrolling code...
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Existing mobile menu toggle code...
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Cart functionality (existing code remains unchanged)...
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const updateCartCount = () => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
  };

  const updateMiniCart = () => {
    const miniCartItems = document.getElementById('mini-cart-items');
    if (cart.length === 0) {
      miniCartItems.innerHTML = '<p class="text-gray-600 font-roboto">Your cart is empty.</p>';
    } else {
      miniCartItems.innerHTML = cart.map(item => `
        <div class="item">
          <span>${item.name} (x${item.quantity})</span>
          <span>$${item.price * item.quantity}</span>
        </div>
      `).join('');
    }
    updateCartCount();
  };

  const updateFullCart = () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cart.length === 0) {
      cartItems.innerHTML = '<tr><td colspan="6" class="text-center text-gray-600 font-roboto">Your cart is empty.</td></tr>';
      cartTotal.textContent = '$0.00';
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <tr>
          <td><img src="${item.image}" alt="${item.name}" class="lazy"></td>
          <td>${item.name}</td>
          <td>
            <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
          </td>
          <td>$${item.price}</td>
          <td>$${item.price * item.quantity}</td>
          <td><button class="remove-item" data-index="${index}">Remove</button></td>
        </tr>
      `).join('');
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    updateCartCount();
  };

  // Add to cart (existing code remains unchanged)...
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const image = button.dataset.image;
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1, image });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateMiniCart();
      updateFullCart();
      alert(`${name} added to cart!`);
    });
  });

  // Update quantity (existing code remains unchanged)...
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('quantity-input')) {
      const index = e.target.dataset.index;
      const quantity = parseInt(e.target.value);
      if (quantity > 0) {
        cart[index].quantity = quantity;
      } else {
        cart.splice(index, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateFullCart();
      updateMiniCart();
    }
  });

  // Remove item (existing code remains unchanged)...
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateFullCart();
      updateMiniCart();
    }
  });

  // Form validation (existing code remains unchanged)...
  const forms = document.querySelectorAll('#subscribe-form, #footer-subscribe-form, #contact-form, #delivery-check');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        alert('Form submitted successfully!');
        form.reset();
      }
    });
  });

  // Delivery form validation (existing code remains unchanged)...
  const deliveryForm = document.getElementById('delivery-form');
  if (deliveryForm) {
    deliveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = deliveryForm.querySelector('#delivery-name').value;
      const address = deliveryForm.querySelector('#delivery-address').value;
      const phone = deliveryForm.querySelector('#delivery-phone').value;
      const email = deliveryForm.querySelector('#delivery-email').value;
      const payment = deliveryForm.querySelector('input[name="payment"]:checked');
      if (name && address && phone && email && payment) {
        alert(`Order placed successfully!\n\nDelivery Details:\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nEmail: ${email}\nPayment: ${payment.value}`);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateFullCart();
        updateMiniCart();
        deliveryForm.reset();
      } else {
        alert('Please fill in all required fields and select a payment option.');
      }
    });
  }

  // Initialize Swiper for testimonials (existing code remains unchanged)...
  if (document.querySelector('.swiper')) {
    new Swiper('.swiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // Lightbox for gallery (existing code remains unchanged)...
  const galleryImages = document.querySelectorAll('.gallery-image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.getElementById('close-lightbox');

  if (galleryImages.length > 0) {
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
      });
    });

    closeLightbox.addEventListener('click', () => {
      lightbox.classList.add('hidden');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
      }
    });
  }

  // Menu filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('bg-orange-100'));
      button.classList.add('bg-orange-100');

      menuItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Initial cart update (existing code remains unchanged)...
  updateMiniCart();
  updateFullCart();
});