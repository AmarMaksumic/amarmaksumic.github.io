function make_element(type, klass, text) {
  let element = document.createElement(type)
  element.setAttribute('class', klass)
  element.innerHTML = text
  
  return element
}

function make_img(klass, src) {
  let element = document.createElement('IMG')
  element.setAttribute('class', klass)
  element.setAttribute('src', src)
  
  return element
}

function make_list(klass, header, items) {
  let element = document.createElement('DIV')
  element.setAttribute('class', klass)

  let list = document.createElement('UL')

  for (var i = 0; i < items.length; i++) {
    let course = document.createElement('LI')
    course.innerHTML = items[i]
    list.appendChild(course)
  }
  element.innerHTML = header + '\n <ul>' + list.innerHTML;
  
  return element
}

function make_link(klass, text, link) {
  let element = document.createElement('A')
  element.setAttribute('class', klass)
  element.setAttribute('href', link)
  element.setAttribute('target', '_blank')
  element.innerHTML = text
  
  return element
}

function fill_card(card, exp, data) {

  let timeline_container = document.createElement('UL')
  timeline_container.setAttribute('class', 'timeline')

  for (position in data['positions']) {

    pos_data = data['positions'][position]   

    let exp_container = document.createElement('LI')
    exp_container.setAttribute('class', 'timeline-event')

    let label = document.createElement('LABEL')
    label.setAttribute('class', 'timeline-event-icon')
    label.setAttribute('style', 'outline: 10px solid ' + data['bg_color'])
    exp_container.appendChild(label)
    
    let exp_info = document.createElement('DIV')
    exp_info.setAttribute('class', 'timeline-event-copy')

    // Equip thumbnail
    let thumbnail = make_element('P', 'timeline-event-thumbnail', pos_data['time'])
    thumbnail.setAttribute('style', 'outline: 10px solid ' + data['bg_color'])
    exp_info.appendChild(thumbnail)

    let divider = document.createElement('DIV')
    divider.setAttribute('style', 'margin-top: 5px; border-top: 3px dotted #bbb;')
    exp_info.appendChild(divider)
 
    if (pos_data['title'] != null) exp_info.appendChild(make_element('H4', null, pos_data['title']))
    // if (pos_data['time'] != null) exp_info.appendChild(make_element('H5', null, pos_data['time']))
    if (pos_data['desc'] != null) exp_info.appendChild(make_element('P', null, pos_data['desc']))

    if (pos_data['desc_list'] != null) {
      for (set in pos_data['desc_list']) {

        let curr_set = pos_data['desc_list'][set]
        if (curr_set['title'] != null) exp_info.appendChild(make_element('P', null, curr_set['title'] + ':'))
        let list = document.createElement('UL');

        for (index in curr_set['items']) {
          let item = document.createElement('LI');
          item.innerHTML = curr_set['items'][index]
          list.appendChild(item)
        }

        exp_info.appendChild(list)
      }
    }

    exp_container.appendChild(exp_info)
    timeline_container.appendChild(exp_container)
  }

  card.appendChild(timeline_container)
}

// Function to initialize experience content
function initializeExperience() {
  $.getJSON('./files/experience.json', function(json_data) {
    let container = document.getElementsByClassName('dyna_container');
    if (container.length === 0) {
      console.log('Experience: dyna_container not found, skipping initialization');
      return;
    }

  for (exp in json_data) {
    let data = json_data[exp]

    let section_container = document.createElement('DIV')
    section_container.setAttribute('class', 'section shadow')
    section_container.setAttribute('style', 'background-color: ' + data['bg_color'] + '; color:' + data['color'])

    section_container.appendChild(make_element('BR', null, null))
    section_container.appendChild(make_element('H3', null, exp))
    var img_container;
    if (data['image'] != null) img_container = make_img('h5em', data['image'])
    if (data['website'] != null) {
      let link = make_link(null, null, data['website'])
      link.appendChild(img_container)
      console.log(link)
      section_container.appendChild(link)
    }
    if (data['website'] != null && data['image'] == null) section_container.appendChild(make_link(null, data['website'], data['website']))
    if (data['website'] == null && data['image'] != null) section_container.appendChild(img_container)
    if (data['image'] != null) section_container.appendChild(make_element('BR', null, null))
    section_container.appendChild(make_element('H4', null, data['time']))

    fill_card(section_container, exp, data)

    container[0].appendChild(section_container)

    let sectionDiv = make_element('DIV', 'section', null);
    sectionDiv.appendChild(make_element('DIV', 'divider', null));
    container[0].appendChild(sectionDiv);
  }
});
}

// Auto-initialize if dyna_container exists (for direct page loads)
if (document.getElementsByClassName('dyna_container').length > 0) {
  initializeExperience();
}

  