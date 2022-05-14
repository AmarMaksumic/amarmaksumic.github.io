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

function fill_card(card, project, data) {
  // Equip title
  card.appendChild(make_element('H3', 'title', project));

  // Equip time span of project
  card.appendChild(make_element('H4', 'time_span', data['start_date'] + ' - ' + data['end_date']));

  // Equip description of project
  card.appendChild(make_element('P', 'description', data['description']));

  // Equip divider
  card.appendChild(make_element('HR', 'solid', ''));

  // Equip resources of project
  card.appendChild(make_resources(data['resources']))
  
  // Equip divider
  card.appendChild(make_element('HR', 'solid', ''));

  // Equip tags of project
  card.appendChild(make_tags(data['tags']));
}

function dynamic_render() {
  console.log(projects);

  let container = document.getElementsByClassName('dynamic content');

  for (project in projects) {
    let data = projects[project];
    let card_container = document.createElement('DIV');
    card_container.setAttribute('class', 'card_column three');
    
    let card = document.createElement('DIV');
    card.setAttribute('class', 'card');

    fill_card(card, project, data)

    card_container.appendChild(card);

    container[0].appendChild(card_container);
  }
}

// dynamic_render()