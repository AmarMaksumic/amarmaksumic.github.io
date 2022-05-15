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
  // Equip thumbnail
  card.appendChild(make_element('P', 'timeline-event-thumbnail', data['time']))

  // Equip expitute name
  card.appendChild(make_element('H3', null, exp))

  // Equip expitute image
  if (data['image'] != null) card.appendChild(make_img('h5em', data['image']))

  if (data['image'] != null && data['website'] != null) {
    card.appendChild(document.createElement('BR'))
    card.appendChild(document.createElement('BR'))
  }
  
  // Equip website 
  if (data['website'] != null) card.appendChild(make_link(null, data['website'], data['website']))

  let divider = document.createElement('DIV')
  divider.setAttribute('style', 'margin-top: 5px; border-top: 3px dotted #bbb;')
  card.appendChild(divider)

  for (position in data['positions']) {
    pos_data = data['positions'][position]    
    if (pos_data['title'] != null) card.appendChild(make_element('H4', null, pos_data['title']))
    if (pos_data['time'] != null) card.appendChild(make_element('H5', null, pos_data['time']))
    if (pos_data['desc'] != null) card.appendChild(make_element('P', null, pos_data['desc']))

    if (pos_data['desc_list'] != null) {
      for (set in pos_data['desc_list']) {

        let curr_set = pos_data['desc_list'][set]
        if (curr_set['title'] != null) card.appendChild(make_element('P', null, curr_set['title'] + ':'))
        let list = document.createElement('UL');

        for (index in curr_set['items']) {
          let item = document.createElement('LI');
          item.innerHTML = curr_set['items'][index]
          list.appendChild(item)
        }

        card.appendChild(list)
      }
    }

    card.appendChild(divider.cloneNode())
  }
}

$.getJSON('./files/experience.json', function(json_data) {
  let container = document.getElementsByClassName('timeline') 

  for (exp in json_data) {
    let data = json_data[exp]
    let exp_container = document.createElement('LI')
    exp_container.setAttribute('class', 'timeline-event')

    let label = document.createElement('LABEL')
    label.setAttribute('class', 'timeline-event-icon')
    exp_container.appendChild(label)
    
    let exp_info = document.createElement('DIV')
    exp_info.setAttribute('class', 'timeline-event-copy')

    fill_card(exp_info, exp, data)

    exp_container.appendChild(exp_info)

    container[0].appendChild(exp_container)
  }
})

  