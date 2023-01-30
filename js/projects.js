let first = false

function make_element(type, klass, text) {
  let element = document.createElement(type);
  element.setAttribute('class', klass);
  element.innerHTML = text;
  
  return element;
}

function make_link(klass, text, link, icon_type) {
  let element = document.createElement('A');
  element.setAttribute('class', klass);
  element.setAttribute('href', link);
  element.setAttribute('target', '_blank');
  element.setAttribute('style', 'color: white')

  var icon;

  if (icon_type != null) {
    icon = '<i class="fa fa-' + icon_type + ' large-icon"></i>&nbsp;&nbsp;'
  } else {
    icon = '';
  }

  element.innerHTML = icon + text;
  
  return element;
}

function make_resources(resources) {
  
  let resources_container = document.createElement('DIV');
  // resources_container.setAttribute('class', 'resources');

  let content_exists = false;

  if (resources['cad'] != null) {
    resources_container.appendChild(make_link('cad', 'CAD Model', resources['cad'], 'cubes'));
    content_exists = true;
  }

  if (resources['github'] != null) {
    if (content_exists == true) resources_container.appendChild(make_element('BR', 'break', ''));
    resources_container.appendChild(make_link('github', 'Repository', resources['github'], 'github'));
    content_exists = true;
  }

  if (resources['website'] != null) {
    if (content_exists == true) resources_container.appendChild(make_element('BR', 'break', ''));
    resources_container.appendChild(make_link('website', 'Website', resources['website'], 'globe'));
    content_exists = true;
  }

  if (content_exists == false) {
    resources_container.appendChild(make_link('contact_for_info', 'Contact for info', 'mailto:amarmaksumich@gmail.com', 'envelope'));
  }

  resources_container.appendChild(make_element('BR', 'break', ''));
  resources_container.appendChild(make_element('BR', 'break', ''));

  return resources_container;
}

function make_tags(tags) {
  let tags_container = document.createElement('DIV');
  tags_container.setAttribute('class', 'tags');
  tags_container.innerHTML = 'Tags:';

  let content_exists = false;

  for (tag in tags) {
    if (content_exists == true) tags_container.innerHTML += ',';
    content_exists = true;
    tags_container.innerHTML += ' ' + tags[tag];
  }

  if (content_exists == false) {
    tags_container.innerHTML = 'No tags.';
  }

  return tags_container;
}

function make_img(klass, src) {
  let element = document.createElement('IMG')
  element.setAttribute('class', klass)
  element.setAttribute('src', src)
  
  return element
}

function fill_card(card, project, data) {
  // Equip title
  card.appendChild(make_element('H3', 'title', project));

  let flex_container = document.createElement('DIV');
  flex_container.setAttribute('class', 'flex-container');

  let flex_item_left = document.createElement('DIV');
  flex_item_left.setAttribute('class', 'flex-item-left');

  flex_item_left.appendChild(make_img(null, data['img']));

  let flex_item_right = document.createElement('DIV');
  flex_item_right.setAttribute('class', 'flex-item-right');

  flex_item_right.appendChild(make_element('H4', 'time', 'Time Span: ' + data['time']));
  flex_item_right.appendChild(make_element('H4', 'description', data['description']));
  flex_item_right.appendChild(make_resources(data['resources']));
  // flex_item_right.appendChild(make_tags(data['tags']));

  flex_container.appendChild(flex_item_left);
  flex_container.appendChild(flex_item_right);
  card.appendChild(flex_container);
}

$.getJSON('./files/projects.json', function(json_data) {

  let container = document.getElementsByClassName('dynamic content');

  for (project in json_data) {
    let data = json_data[project];

    let section_container = document.createElement('DIV')
    section_container.setAttribute('class', 'section cone shadow')

    let content_container = document.createElement('DIV')
    content_container.setAttribute('class', 'content')
    content_container.setAttribute('style', 'padding-top: 0px; padding-bottom: 15px;')

    fill_card(content_container, project, data)

    section_container.appendChild(content_container)

    container[0].appendChild(section_container)

    container[0].appendChild(make_element('DIV', 'section', null).appendChild(make_element('DIV', 'divider', null)))
  }

  
  // $(".option").click(function(){
  //   $(".option").removeClass("active");
  //   $(this).addClass("active");
    
  // });

  // if ( (window.matchMedia("(max-width: 700px)").matches) && window.innerHeight > window.innerWidth) {
  //   alert("Please use Landscape!");
  // }

  // setInterval(function() {
  //   if ( (window.matchMedia("(max-width: 700px)").matches) && window.innerHeight > window.innerWidth) {
  //     alert("Please use Landscape!");
  //   } 
  // }, 5000);
})