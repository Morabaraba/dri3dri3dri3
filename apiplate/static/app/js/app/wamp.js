/* global $ _ Backbone Slick dataView autobahn WAMP_CONNECTION WampCollection */
(function() {
	var app = window.app = window.app || {};
	app.wamp = app.wamp || {};
	
	app.wamp.connect = function connect() {
         console.log("Runnning on AutobahnJS ", autobahn.version);

         // the URL of the WAMP Router (Crossbar.io)
         //
         var wsuri;
         if (document.location.origin == "file://") {
            wsuri = "ws://127.0.0.1:8080/ws";

         } else {
            wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                        document.location.host + "/ws";
         }
         
        window.WAMP_OTHER_ID = "nodejs";
        window.WAMP_CONNECTION = new autobahn.Connection({
          url: wsuri,
          realm: "realm1"
        });
        
        WAMP_CONNECTION.onopen = function () {
            console.log('WAMP_CONNECTION.onopen');
          var Collection = WampCollection.extend({
            url: "test_collection"
          });
          var collection = new Collection();
          collection.fetch(); // call wampRead below
          collection.create({ // call wampCreate below
            age: 36,
            name: "John"
          }, {
            success: function () {
              collection.first().destroy(); // call wampDelete below
            }
          });
          app.state.collection = collection
        };
        
        WAMP_CONNECTION.open();
        return WAMP_CONNECTION
    };


})();
