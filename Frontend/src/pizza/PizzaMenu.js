/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Оновлення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

var $pizzavar = $(".filter-body");
var inType = "";
$pizzavar.find("a").click(function(){
    inType = this.innerHTML + '  ';
    $pizzavar.find("#name_of_pizza").text(inType);
    filterPizza(this.innerHTML);
});
$pizzavar.find("#all").click(function () {
    $pizzavar.find("#pizza-num").text(8);
});
$pizzavar.find("#meat").click(function () {
    $pizzavar.find("#pizza-num").text(5);
});
$pizzavar.find("#pineapple").click(function () {
    $pizzavar.find("#pizza-num").text(3);
});
$pizzavar.find("#mushroom").click(function () {
    $pizzavar.find("#pizza-num").text(3);
});
$pizzavar.find("#sea").click(function () {
    $pizzavar.find("#pizza-num").text(2);
});
$pizzavar.find("#vega").click(function () {
    $pizzavar.find("#pizza-num").text(1);
});

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if(filter === "Усі"){
        pizza_shown = Pizza_List;
    }
    if(filter==="М'ясні"){
        Pizza_List.forEach(function (pizza) {
            if(pizza.type === 'М’ясна піца'){
                pizza_shown.push(pizza);
            }
        });
    }
    if(filter==="З ананасами"){
        Pizza_List.forEach(function (pizza) {
            if(pizza.content.pineapple){
                pizza_shown.push(pizza);
            }
        });
    }
    if(filter==="З грибами"){
        Pizza_List.forEach(function (pizza) {
            if(pizza.content.mushroom){
                pizza_shown.push(pizza);
            }
        });
    }
    if(filter==="З морепродуктами"){
        Pizza_List.forEach(function (pizza) {
            if(pizza.type === 'Морська піца'){
                pizza_shown.push(pizza);
            }
        });
    }
    if(filter==="Вега"){
        Pizza_List.forEach(function (pizza) {
            if(pizza.type === 'Вега піца'){
                pizza_shown.push(pizza);
            }
        });
    }
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;