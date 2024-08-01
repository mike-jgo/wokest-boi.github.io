document.addEventListener('DOMContentLoaded', () => {
    const productListElement = document.querySelector('.secondBoxImages');
    let listCartHTML = document.querySelector('.cartList');
    let iconCartSpan = document.querySelector('.numItems');
    let totalCostElement = document.querySelector('.totalCost');
    let cart = [];

    const updateCartUI = (cart, totalCost) => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
    
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                const itemBox = document.createElement('div');
                itemBox.classList.add('itemBox');
                itemBox.innerHTML = `
                    <img src="${item.productId.image}" alt="${item.productId.name}">
                    <p class="image-text">${item.productId.name}</p>
                    <p class="image-text">₱${item.productId.price * item.quantity}</p>
                    <div class="quantity">
                        <span class="minus" data-id="${item.productId._id}">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${item.productId._id}">+</span>
                    </div>
                `;
                listCartHTML.appendChild(itemBox);
            });
        } else {
            listCartHTML.innerHTML = '<p>Your cart is empty.</p>';
        }
    
        iconCartSpan.textContent = totalQuantity;
        console.log('Total Cost:', totalCost);
        totalCostElement.textContent = `Total Cost: ₱${totalCost.toFixed(2)}`;
    };

    const addToCart = async (productId) => {
        try {
            const productResponse = await fetch(`/products/${productId}`);
            const product = await productResponse.json();
            const price = product.price;

            console.log('Adding product to cart:', productId, price); 
            const response = await fetch('/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1,
                    price: product.price
                }),
            });
            const data = await response.json();
            if (data.success) {
                cart = data.cart;
                updateCartUI(cart, data.totalCost); 
            } else {
                alert('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const changeQuantity = async (productId, type) => {
        try {
            const response = await fetch('/update-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: productId,
                    type: type
                })
            });
            const data = await response.json();
            if (data.success) {
                cart = data.cart;
                updateCartUI(cart, data.totalCost); 
            } 
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    productListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('button-30')) {
            const productId = event.target.getAttribute('data-id');
            addToCart(productId);
        }
    });

    listCartHTML.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('minus') || target.classList.contains('plus')) {
            const productId = target.getAttribute('data-id');
            const type = target.classList.contains('plus') ? 'plus' : 'minus';
            changeQuantity(productId, type);
        }
    });

});
