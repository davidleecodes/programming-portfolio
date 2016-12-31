//test
var Project = Backbone.Model.extend({
	idAttribute:"url",
	defaults:function(){
		console.log("hits");
		return{

		};
	},//default
});



var Projects = Backbone.Collection.extend({
	model:Project,
	url:"json/projects.json",
});



var ProjectView = Backbone.View.extend({
	initialize:function(options){
		var self = this;
		this.bus = options.bus;
	},

	render: function(){
		console.log("render project model");
		var template = _.template($("#thumbnailTemplate").html());
		var html = template(this.model.toJSON());
		this.$el.html(html);
		return this;
	},//render
});



var ProjectsView= Backbone.View.extend({
	initialize:function(options){
		var self = this;
		this.bus = options.bus;
	},

	render:function(){
		console.log("collections render");
		var self = this;
		this.collection.each(function(obj){
			var projectView = new ProjectView({model:obj, bus:self.bus});
			self.$el.find("hr").before(projectView.render().$el);
		});
	}
});



var HeaderNavView= Backbone.View.extend({
	initialize:function(options){
		console.log("headerNavView");
		var self = this;
		this.bus = options.bus;
		console.log($(".header-container"));
	},

	events:{
		"click .nav-logo":"onHomeClick",
		"click .nav-project": "onProjectsClick",
		"click .nav-about": "onAboutClick",
		"click .nav-contact": "onContactClick",
		"click .menu-icon":"showDropMenu"
	},

	showDropMenu: function(){
		console.log("menuiconclicked");
		$(".menu-dropdown").toggleClass("showMenu");
	},

	onProjectsClick:function(e){
		e.preventDefault();
		console.log("headerNavProjectsClicked");
		router.navigate("projects",{trigger:true});
		$(".menu-dropdown").toggleClass("showMenu");
	},

	onHomeClick:function(e){
		e.preventDefault();
		console.log("headerNavHomeClicked");
		router.navigate("home",{trigger:true});
		$(".menu-dropdown").toggleClass("showMenu");
	},

	onContactClick:function(e){
		e.preventDefault();
		console.log("headerNavContactClicked");
		router.navigate("contact",{trigger:true});
		$(".menu-dropdown").toggleClass("showMenu");
	},

	onAboutClick:function(e){
		e.preventDefault();
		console.log("headerNavHomeClicked");
		router.navigate("about",{trigger:true});
		$(".menu-dropdown").toggleClass("showMenu");
	},

});



var projects = new Projects();
var eventBus = _.extend({},Backbone.Events);
var headerNavView = new HeaderNavView({el:".nav-container",bus:eventBus});



var AppRouter = Backbone.Router.extend({
	initialize:function(options){
		var self = this;
		this.bus = options.bus;
	},

	routes:{
		"": "viewHome",
		"home": "about",
		"projects":"projects",
		"about":"about",
		"contact":"contact",
		"*other":"defaultRoute"
	},

	viewHome:function(){
		console.log("home");
	},

	projects:function(){
		console.log("project");
		this.scrollTo($(".thumbnail-container"));
	},

	about:function(){
		console.log("about");
		this.scrollTo($(".about-container"));
	},

	contact:function(){
		console.log("contact");
		this.scrollTo($(".contact-container"));
	},

	scrollTo:function(target){
		console.log($(".about-container").offset().top);
		var topOffset = ($(window).width()<800)? $(".about-container").offset().top :0;
		$('html, body').stop().animate({
			scrollTop: target.offset().top-topOffset
		}, 1000);
	},

	defaultRoute:function(){
		console.log("page not found");
	}
});



var router;


projects.fetch({
	success:function(){
		console.log("test");
		console.log(projects);


		var projectsView = new ProjectsView({ el:"#thumbnails", collection:projects, bus:eventBus});
		projectsView.render();

		router = new AppRouter({bus:eventBus});
		Backbone.history.start();
	}
});
