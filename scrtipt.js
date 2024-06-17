const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

function vejaMeuCarrinho() {
  // pode funcionar dessa mandeira, removendo a classe tailwind hidden e adicionando a classe flex
  updateCartModal();
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
  // também funciona dessa maneira adicionado um style para exibir o modal
  // cartModal.style.display = "flex"
}

function fecharCarrinho() {
  // pode funcionar dessa mandeira, removendo a classe tailwind hidden e adicionando a classe flex
  cartModal.classList.remove("flex");
  cartModal.classList.add("hidden");

  // também funciona dessa maneira adicionado um style para exibir o modal
  // cartModal.style.display = "none"
}

function fecharModalAoclicar(event) {
  if (event.target === cartModal) {
    cartModal.classList.remove("flex");
    cartModal.classList.add("hidden");
    // cartModal.style.display = 'none'
  }
}

function adicionarProdutosNoCarrinho(event) {
  // console.log(event.target)

  //pega o item próximo da classe
  let parentButton = event.target.closest(".add-to-cart-btn");

  // faz a verificação quando pegar o parentButton
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionar no carrinho
    addToCart(name, price);
  }
}

//Função para adicionar no carrinho
function addToCart(name, price) {
  // find retornar o elemento repetido
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //se o item já existe, aumenta apenas a quantidade + 1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "flex-col",
      "mb-4"
    );
    cartItemElement.innerHTML = `
            <div class="flex items-center justify-between border-b border-r-gray-400 border-solid">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>(Quantidade: ${item.quantity})</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                    <button data-name="${
                      item.name
                    }" class="remove-from-cart-btn px-2 py-1 text-white rounded bg-red-600 hover:bg-red-500 hover:active:bg-red-400">Remover</button>
                
            </div>
        `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

function removerItemDoCarrinho(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
}

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

function enviarPedido() {
  const isOpen = checkRestauranteOpen();

  if (!isOpen) {
    Toastify({
        text: "Restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast()
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //Enviar o pedido para a pi whats
  const cartItems = cart.map(item => {
    return (
        `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} | `
    )
  }).join("")

 

  const message = encodeURIComponent(cartItems)
  const phone = "5551998152732" 
  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}, Total: ${cartTotal.textContent}`,"_blank")

  cart = []
  updateCartModal()
}

//abrir o modal do carrinho
cartBtn.addEventListener("click", vejaMeuCarrinho);

//fechar o modal ao clicar nele
cartModal.addEventListener("click", fecharModalAoclicar);

//fechar o modal do carrinho ao fechar o botao
closeModalBtn.addEventListener("click", fecharCarrinho);

//adiciona o produto ao clicar no icone do carinho
menu.addEventListener("click", adicionarProdutosNoCarrinho);

// função para remover item do carrinho
cartItemsContainer.addEventListener("click", removerItemDoCarrinho);

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

//finaliza o pedido
checkoutBtn.addEventListener("click", enviarPedido);

// Verificar a hora e maipular o card do horario
function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  console.log(hora)
  return hora >= 0 && hora < 22;
  // true restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
