/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage=require('../Storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var sum=0;

//HTML едемент куди будуть додаватися піци
var $cart = $(".cart-menu");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    $("#to-buy").css('display','inline');
    $(".buying").css('bottom','10px');
    $(".buying").removeAttr('disabled');

    var pizzaIsNew=true;

    for (var a = 0; a < Cart.length; a++) {
        if ((pizza.id === Cart[a].pizza.id) && (size === Cart[a].size)) {
            Cart[a].quantity += 1;
            pizzaIsNew = false;
        }
    }
    if(pizzaIsNew){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    $("#amount_of_pizza").text(Cart.length);
    sum = sum + pizza[size].price;
    $(".price1").find('a').text(sum);
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
    var html = Templates.PizzaCart_OneItem(cart_item);

    var $node = $(html);
    $node.find(".remove").click(function(){
        $node.remove();
    });
    Cart.splice(Cart.indexOf(cart_item), 1)
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders =	Storage.get('cart');
    if(saved_orders)	{
        Cart=saved_orders;
    }
    var savedAmount=Storage.get("price");
    if(savedAmount){
        $(".price1").find('a').text(savedAmount);
        sum=parseInt($(".price1").find('a').text());
    }
    var savedOrder= Storage.get('amount_of_pizza');
    $("#amount_of_pizza").text(savedOrder);
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}
$(".title").click(function () {
    Cart=[];
    $(".price1").find('a').text(0);
    $("#amount_of_pizza").text(0);
    updateCart();
});

$("#amount_of_pizza").text(Cart.length);
$("#to-buy").css('display','none');
$(".buying").css('bottom','37px');


function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        var price_of_one_pizza = cart_item.size.price;

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц

            cart_item.quantity++;
            sum = sum + cart_item[size].price;
            $(".price1").find('a').text(sum);

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц

            if(cart_item.quantity>1){
                cart_item.quantity = cart_item.quantity-1;
            }else{
                removeFromCart(cart_item);
                $("#amount_of_pizza").text(Cart.length);
            }

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".remove").click(function(){
            removeFromCart(cart_item);
            $("#amount_of_pizza").text(Cart.length);
            sum = 0;
            updateCart();
        });

        $cart.append($node);

    }

    Cart.forEach(showOnePizzaInCart);
    Storage.set("price",sum);
    Storage.set("cart",Cart);
    Storage.set("amount_of_pizza",Cart.length);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;