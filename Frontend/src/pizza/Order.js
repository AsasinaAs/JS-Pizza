var API = require("../API");
var PizzaCart = require("./PizzaCart");
var $html = $('.content-b');

var inputA = $('#inputAdress');
var first = false;
var second = false;
var third = false;

function initialiseOrder(){
    google.maps.event.addDomListener(window,'load',	initialize);

    function initialize() {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionService =	new	google.maps.DirectionsService();
        var geocoder	=	new	google.maps.Geocoder();
        var mapProp =	{
            center:	new	google.maps.LatLng(50.464379,30.519131),
            zoom:	11
        };
        var html_element =	document.getElementById("googleMap");
        var map	=	new	google.maps.Map(html_element,	 mapProp);

        var point	=	new	google.maps.LatLng(50.464379,30.519131);
        var homeMarker;
        var marker	=	new	google.maps.Marker({
            position:	point,
            map:	map,
            icon:	"assets/images/map-icon.png",
            animation: google.maps.Animation.DROP
        });

        directionsDisplay.setMap(map);
        directionsDisplay.setOptions( { suppressMarkers: true } );
        //Карта створена і показана

        google.maps.event.addListener(map, 'click',function(me){
            createPath(me.latLng,true);
        });

        inputA.on('keyup', function() {
            if(inputA.css('border-color')=='green'){
                var address = inputA.val();
                $(".summery-adress").html("<b>Адреса доставки:</b> "+inputA.val());
                geocodeAddress(address,function(err,coordinates){
                    if(!err){
                        createPath(coordinates,false);
                    }else{
                        cantFindAdress();
                    }
                });
            }
        });
        function createPath(coordinates, updateAdress){
            geocodeLatLng(coordinates,	function(err,adress){
                if(updateAdress){
                    $(".summery-adress").html("<b>Адреса доставки:</b> "+adress);
                    inputA.val(adress);
                }
                if(!err){//Дізналися адресу
                    if(!homeMarker){
                        homeMarker = new google.maps.Marker({
                            position: coordinates,
                            map: map,
                            icon: "assets/images/home-icon.png"
                        });
                    }else{
                        homeMarker.setMap(map);
                        homeMarker.setPosition(coordinates);
                    }
                    calculateRoute(point,coordinates,function(err,result){
                        if(!err){
                            $(".summery-time").html('<b>Приблизний час доставки: </b>' + result.duration.text);
                            $(".summery-adress").html("<b>Адреса доставки:</b> "+ inputA.val());
                        }else{
                            cantFindAdress();
                            //console.log(err);
                        }
                    });
                }else{
                    cantFindAdress();
                    //console.log("Немає адреси\n"+err);
                }
            });
        }
        function cantFindAdress(err){
            directionsDisplay.setMap(null);
            if(homeMarker)
                homeMarker.setMap(null);
            $(".summery-time").html("<b>Приблизний час доставки:</b> невідомий");
        }
        function calculateRoute(A_latlng,B_latlng,callback)	{
            directionsDisplay.setMap(map);
            directionService.route({
                origin:	A_latlng,
                destination:	B_latlng,
                travelMode:	google.maps.TravelMode["DRIVING"]
            },	function(response,	status)	{
                if	(	status	==	google.maps.DirectionsStatus.OK )	{
                    directionsDisplay.setDirections(response);
                    var leg	=	response.routes[	0	].legs[	0	];
                    callback(null,	{
                        duration:	leg.duration
                    });
                }	else	{
                    callback(new	Error("Can'	not	find	direction"));
                }
            });
        }
        function	geocodeLatLng(latlng,	 callback){//Модуль за роботу з адресою
            geocoder.geocode({'location':	latlng},	function(results,	status)	{
                if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                    var adress =	results[1].formatted_address;
                    callback(null,	adress);
                }	else	{
                    callback(new	Error("Can't	find	adress"));
                }
            });
        }
        function	geocodeAddress(adress,	 callback)	{
            geocoder.geocode({'address':	adress},	function(results,	status)	{
                if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
                    var coordinates	=	results[0].geometry.location;
                    callback(null,	coordinates);
                }	else	{
                    callback(new	Error("Can	not	find	the	adress"));
                }
            });
        }
    }
}

$(".next-step-button").click(function() {
    var totalPrice = 0;
    PizzaCart.getPizzaInCart().forEach(function (cart_item) {
        totalPrice += cart_item.quantity * cart_item.pizza[cart_item.size].price
    });

    API.createOrder({
        name: $('#inputName').val(),
        phone: $('#inputPhone').val(),
        address: inputA.val(),
        pizza: PizzaCart.getPizzaInCart(),
        price: totalPrice
    }, function (err, result) {
        if (err) {
            alert("Can't create order");
        } else {
            $.ajax({
                method: "POST",
                url: "/api/newOrder",
                data: result.data,
                success: function (res) {
                    window.location = "/"
                }
            })
        }
    });
});

exports.initialiseOrder = initialiseOrder;