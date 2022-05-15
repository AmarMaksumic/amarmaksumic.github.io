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

function fill_card(card, inst, data) {
  // Equip and color thumbnail
  let thumbnail = make_element('P', 'timeline-event-thumbnail', data['time'])
  thumbnail.setAttribute('style', 'outline: 10px solid ' + data['bg_color'])
  card.appendChild(thumbnail)

  // Equip institute name
  card.appendChild(make_element('H3', null, inst))

  // Equip institute image
  if (data['image'] != null) card.appendChild(make_img('h5em', data['image']))

  if (data['image'] != null && data['website'] != null) {
    card.appendChild(document.createElement('BR'))
    card.appendChild(document.createElement('BR'))
  }
  
  // Equip website 
  if (data['website'] != null) card.appendChild(make_link(null, data['website'], data['website']))

  // Equip degree 
  if (data['degree'] != null) card.appendChild(make_element('H4', null, 'Degree: ' + data['degree']))

  // Equip degree 
  if (data['sdegree'] != null) card.appendChild(make_element('H4', null, data['sdegree']))
  
  // Equip GPA 
  if (data['gpa'] != null) card.appendChild(make_element('P', null, '<strong>GPA:</strong> ' + data['gpa']))

  // Equip socs_and_acts 
  if (data['socs_and_acts'] != null) card.appendChild(make_list(null, '<strong>Socities & Activities:</strong> ', data['socs_and_acts']))
  
  // Equip hons_and_awds 
  if (data['hons_and_awds'] != null) card.appendChild(make_list(null, '<strong>Honors & Awards:</strong> ', data['hons_and_awds']))
  
  // Equip classes 
  if (data['courses'] != null) card.appendChild(make_list(null, '<strong>Classes:</strong>', data['courses']))
  if (data['courses'] != null) card.appendChild(make_element('P', null, ''))
}

$.getJSON('./files/education.json', function(json_data) {
  let container = document.getElementsByClassName('dyna_container') 

  for (inst in json_data) {
    let data = json_data[inst]

    let section_container = document.createElement('DIV')
    section_container.setAttribute('class', 'section shadow')
    section_container.setAttribute('style', 'background-color: ' + data['bg_color'] + '; color:' + data['color'])

    section_container.appendChild(make_element('BR', null, null))
    
    let timeline_container = document.createElement('UL')
    timeline_container.setAttribute('class', 'timeline')

    let inst_container = document.createElement('LI')
    inst_container.setAttribute('class', 'timeline-event')

    let label = document.createElement('LABEL')
    label.setAttribute('class', 'timeline-event-icon')
    label.setAttribute('style', 'outline: 10px solid ' + data['bg_color'])
    inst_container.appendChild(label)
    
    let inst_info = document.createElement('DIV')
    inst_info.setAttribute('class', 'timeline-event-copy')

    fill_card(inst_info, inst, data)

    inst_container.appendChild(inst_info)

    timeline_container.appendChild(inst_container)

    section_container.appendChild(make_element('BR', null, null))
    
    section_container.appendChild(timeline_container)

    container[0].appendChild(section_container)

    container[0].appendChild(make_element('DIV', 'section', null).appendChild(make_element('DIV', 'divider', null)))
  }
})

  