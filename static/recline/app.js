/* global jQuery recline */
jQuery(function($) {
  window.multiView = null;
  window.explorerDiv = $('.data-explorer-here');
  jQuery.get('//dailyprogrammer-333-openhazel.c9users.io:8080/v1/get-voters-where', function(data) {
    // create the demo dataset
    var records = []
    _.each(data, function(record) {
        var keys = Object.keys(record);
        _.each(keys, function(key) {
          if (key.indexOf(':@') === -1) return;
          var v = record[key];
          var stippedKey = key.replace(':@', '__');
          record[stippedKey] = v;
          delete record[key];
        })
        records.push(record);
    })
    var dataset = createDemoDataset(records);
    // now create the multiview
    // this is rather more elaborate than the minimum as we configure the
    // MultiView in various ways (see function below)
    window.multiview = createMultiView(dataset);
    // last, we'll demonstrate binding to changes in the dataset
    // this will print out a summary of each change onto the page in the
    // changelog section
    /*
    dataset.records.bind('all', function(name, obj) {
      var $info = $('<div />');
      $info.html(name + ': ' + JSON.stringify(obj.toJSON()));
      $('.changelog').append($info);
      $('.changelog').show();
    });
    */
  })  
});

// create standard demo dataset
function createDemoDataset(records) {
  var dataset = new recline.Model.Dataset({
    records: records,
  });
  return dataset;
}

// make MultivView
//
// creation / initialization in a function so we can call it again and again
var createMultiView = function(dataset, state) {
  // remove existing multiview if present
  var reload = false;
  if (window.multiView) {
    window.multiView.remove();
    window.multiView = null;
    reload = true;
  }

  var $el = $('<div />');
  $el.appendTo(window.explorerDiv);

  // customize the subviews for the MultiView
  var views = [
    {
      id: 'grid',
      label: 'Grid',
      view: new recline.View.SlickGrid({
        model: dataset,
        state: {
          gridOptions: {
            editable: true,
            // Enable support for row add
            enabledAddRow: true,
            // Enable support for row delete
            enabledDelRow: true,
            // Enable support for row ReOrder 
            enableReOrderRow:true,
            autoEdit: false,
            enableCellNavigation: true
          },
          columnsEditor: [
            { column: 'date', editor: Slick.Editors.Date },
            { column: 'sometext', editor: Slick.Editors.Text }
          ]
        }
      })
    },
    {
      id: 'graph',
      label: 'Graph',
      view: new recline.View.Graph({
        model: dataset

      })
    },
    {
      id: 'map',
      label: 'Map',
      view: new recline.View.Map({
        model: dataset
      })
    }
  ];

  var multiView = new recline.View.MultiView({
    model: dataset,
    el: $el,
    state: state,
    views: views
  });
  return multiView;
}