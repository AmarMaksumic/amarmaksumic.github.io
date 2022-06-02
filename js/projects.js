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
  resources_container.setAttribute('class', 'resources');

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

  return resources_container;
}

function make_tags(tags) {
  let tags_container = document.createElement('DIV');
  tags_container.setAttribute('class', 'tags');
  tags_container.innerHTML = 'Tags:';

  let content_exists = false;

  for (tag in tags) {
    content_exists = true;
    let tag_element = document.createElement('SPAN');
    tag_element.setAttribute('class', 'tag_text');
    tag_element.innerHTML = tags[tag];
    tags_container.appendChild(tag_element);
  }

  if (content_exists == false) {
    tags_container.innerHTML = 'No tags.';
  }

  return tags_container;
}

function fill_card(card, era, data) {
  // Equip title
  card.appendChild(make_element('H3', 'title', era));
  
  let options_container = document.createElement('DIV')
  options_container.setAttribute('class', 'options')

  for (project in data) {

    proj_data = data[project]

    let option = document.createElement('DIV')
    if (first) {
      first = false
      option.setAttribute('class', 'option active')
    } else {
      option.setAttribute('class', 'option')
    }
    option.setAttribute('style', '--optionBackground:url(../' + proj_data['img'] +');')

    shadow = document.createElement('DIV')
    shadow.setAttribute('class', 'shadow')

    option.appendChild(shadow)

    label = document.createElement('DIV')
    label.setAttribute('class', 'label')

    icon = document.createElement('DIV')
    icon.setAttribute('class', 'icon')
    icon.innerHTML = proj_data['4_letter']

    label.appendChild(icon)

    info = document.createElement('DIV')
    info.setAttribute('class', 'info')

    main = document.createElement('DIV')
    main.setAttribute('class', 'main')
    main.innerHTML = project

    sub_date = document.createElement('DIV')
    sub_date.setAttribute('class', 'sub')
    sub_date.innerHTML = proj_data['time']

    info.appendChild(main)
    info.appendChild(sub_date)

    label.appendChild(info)
    
    desc = document.createElement('DIV')
    desc.setAttribute('class', 'desc')
    desc.innerHTML = proj_data['description']
    option.appendChild(desc)

    option.appendChild(label)

    options_container.appendChild(option)
  }

  card.appendChild(options_container)
}

$.getJSON('./files/projects.json', function(json_data) {

  let container = document.getElementsByClassName('dynamic content');

  for (era in json_data) {

    let data = json_data[era];
    console.log(era)
    console.log(data)

    let section_container = document.createElement('DIV')
    section_container.setAttribute('class', 'section cone shadow')

    let content_container = document.createElement('DIV')
    content_container.setAttribute('class', 'content')
    content_container.setAttribute('style', 'padding-top: 0px; padding-bottom: 15px;')

    fill_card(content_container, era, data)

    section_container.appendChild(content_container)

    container[0].appendChild(section_container)

    container[0].appendChild(make_element('DIV', 'section', null).appendChild(make_element('DIV', 'divider', null)))
  }

  
  $(".option").click(function(){
    $(".option").removeClass("active");
    $(this).addClass("active");
    
  });

  if ( (window.matchMedia("(max-width: 700px)").matches) && window.innerHeight > window.innerWidth) {
    alert("Please use Landscape!");
  }

  setInterval(function() {
    if ( (window.matchMedia("(max-width: 700px)").matches) && window.innerHeight > window.innerWidth) {
      alert("Please use Landscape!");
    } 
  }, 5000);
})