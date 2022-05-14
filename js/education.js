function make_element(type, klass, text) {
  let element = document.createElement(type)
  element.setAttribute('class', klass)
  element.innerHTML = text
  
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

  console.log(list)

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
  // Equip thumbnail
  card.appendChild(make_element('P', 'timeline-event-thumbnail', data['time']))

  // Equip institute name
  card.appendChild(make_element('H3', null, inst))

  // Equip degree 
  if (data['degree'] != null) card.appendChild(make_element('H4', null, 'Degree: ' + data['degree']))

  // Equip degree 
  if (data['sdegree'] != null) card.appendChild(make_element('H4', null, data['sdegree']))
  
  // Equip GPA 
  if (data['gpa'] != null) card.appendChild(make_element('P', null, 'GPA: ' + data['gpa']))

  // Equip socs_and_acts 
  if (data['socs_and_acts'] != null) card.appendChild(make_element('P', null, 'Socities & Acitivites: ' + data['socs_and_acts']))
  
  // Equip hons_and_awds 
  if (data['hons_and_awds'] != null) card.appendChild(make_element('P', null, 'Honors & Awards: ' + data['hons_and_awds']))
  
  // Equip classes 
  if (data['courses'] != null) card.appendChild(make_list(null, 'Classes:', data['courses']))
  if (data['courses'] != null) card.appendChild(make_element('P', null, ''))

  // Equip website 
  if (data['website'] != null) card.appendChild(make_link(null, data['website'], data['website']))
}

$.getJSON('./files/education.json', function(json_data) {
  let container = document.getElementsByClassName('timeline') 

  for (inst in json_data) {
    let data = json_data[inst]
    let inst_container = document.createElement('LI')
    inst_container.setAttribute('class', 'timeline-event')

    let label = document.createElement('LABEL')
    label.setAttribute('class', 'timeline-event-icon')
    inst_container.appendChild(label)
    
    let inst_info = document.createElement('DIV')
    inst_info.setAttribute('class', 'timeline-event-copy')

    fill_card(inst_info, inst, data)

    inst_container.appendChild(inst_info)

    container[0].appendChild(inst_container)
  }
})

  