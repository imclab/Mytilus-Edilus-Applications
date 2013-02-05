define(
[
	'happy/app/BaseApp',
	'happy/utils/http',

	'happy/_libs/amd-utils/array'
],
function (
	BaseApp,
	http,
	arrayUtils
){
	var App = function(){
		var 
		self = this,
		container,
		host = "http://mixology.eu01.aws.af.cm/",
		action = 'flavors'; 

		var setup = function(){	
			self.setFPS(0);

			var formContainer = document.createElement('div');
			self.container.appendChild(formContainer);

			var name = document.createElement('input');
			name.type = 'text';
			name.placeholder = 'name';
			formContainer.appendChild(name);

			var color = document.createElement('input');
			color.type = 'text';
			color.placeholder = 'color';
			formContainer.appendChild(color);

			var addBtn = document.createElement('button');
			addBtn.innerHTML = 'add';
			formContainer.appendChild(addBtn);			
			addBtn.addEventListener('click', function(){
				add(name.value, color.value);
			});

			container = document.createElement('div');
			self.container.appendChild(container);

			refresh();
		}

		var refresh = function(){
			http.call({
				url: host + 'api/' + action + '?'+(new Date()).getTime() ,
				onSuccess: function(request){
					createList(JSON.parse(request.response));
				}
			})
		}
		var createList = function(data){
			while (container.hasChildNodes()) {
				container.removeChild(container.lastChild);
			}
			arrayUtils.forEach(data, createSingle);
		}
		var createSingle = function(data){
			var item = document.createElement('div');
			item.style.color = data.color;
			item.style.backgroundColor	 = data.color;
			item.id = data._id; 

			var name = document.createElement('input');
			name.type = 'text';
			name.value = data.name;
			item.appendChild(name);

			var color = document.createElement('input');
			color.type = 'text';
			color.value = data.color;
			item.appendChild(color);

			var updateBtn = document.createElement('button');
			updateBtn.innerHTML = 'update';
			updateBtn.addEventListener('click', function(){
				update(data._id, name.value, color.value);
			});
			item.appendChild(updateBtn);

			var delBtn = document.createElement('button');
			delBtn.innerHTML = 'remove';
			delBtn.addEventListener('click', function(){
				remove(data._id);
			});	
			item.appendChild(delBtn);		

			container.appendChild(item);
		}

		var add = function(name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/' + action,
				method: 'POST',
				data: data,
				onSuccess: refresh
			});
		}
		var update = function(id, name, color){
			var data = new FormData();
			data.append("name", name);
			data.append("color", color);

			http.call({
				url: host + 'api/' + action + '/' + id,
				method: 'PUT',
				data: data,
				onSuccess: refresh
			});
		}
		var remove = function(id){
			http.call({
				url: host + 'api/' + action + '/' + id,
				method: 'DELETE',
				onSuccess: refresh
			})
		}

		self.setup = setup;
	}
	App.prototype = new BaseApp();
	return App;
});