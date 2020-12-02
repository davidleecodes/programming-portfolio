//test
var Project = Backbone.Model.extend({
  idAttribute: "url",
  defaults: function () {
    console.log("hits");
    return {};
  }, //default
});

var Projects = Backbone.Collection.extend({
  model: Project,
  url: "json/projects.json",
});

var ProjectView = Backbone.View.extend({
  initialize: function (options) {
    var self = this;
    this.bus = options.bus;
  },

  render: function () {
    console.log("render project model");
    var template = _.template($("#thumbnailTemplate").html());
    var html = template(this.model.toJSON());
    this.$el.html(html);
    console.log(this);

    return this;
  }, //render
});

var ProjectsView = Backbone.View.extend({
  initialize: function (options) {
    var self = this;
    this.bus = options.bus;
  },

  render: function () {
    console.log("collections render");
    var self = this;
    this.collection.each(function (obj) {
      var projectView = new ProjectView({ model: obj, bus: self.bus });
      self.$el.find("hr").before(projectView.render().$el);
    });
  },
});

var projects = new Projects();
var eventBus = _.extend({}, Backbone.Events);

projects.fetch({
  success: function () {
    console.log("test");
    console.log(projects);

    var projectsView = new ProjectsView({
      el: "#thumbnails",
      collection: projects,
      bus: eventBus,
    });
    projectsView.render();
  },
});
