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

projects = {
  "VeZa": {
    "description": "Web service using topology and knot theory for management and viewing of family trees. Utilizes D3 Tree to render family trees, and a flask server on Repl.it to store user and tree data.",
    "start_date": "Feb '21",
    "end_date": "WIP",
    "resources": {
      "github": "https://github.com/AmarMaksumic/VeZa",
      "website": "https://amarmaksumic.github.io/VeZa/web/index.html"
    },
    "tags": ["Web App"]
  },
  "BlueComms": {
    "description": "Cross-Computer communication for functions like copy, paste, cut, etc. using Bluetooth. Currently working on designing an installer for the code so that it can run as a background program instead of a script that must be manually executed on machine startup.",
    "start_date": "Jan '21",
    "end_date": "WIP",
    "resources": {
      "github": "https://github.com/AmarMaksumic/BlueComms"
    },
    "tags": ["IoT & Networking"]
  },
  "Power Take-Off Gearbox": {
    "description": "Drop-in replacement for VexPro Three CIM Ball Shifter, while providing independent outputs to two mechanisms. All electronics and pneumatics are located to one side (to prevent interference with wheels and chassis), and the second output is fitted with a power shuttle to reverse output direction (in the case that both outputs run at the same time).",
    "start_date": "Mar '20",
    "end_date": "Jul '21",
    "resources": {},
    "tags": ["Mechanical Engineering"]
  },
  "Aquila Heavy": {
    "description": "Thrust Vector Controlled model rocket using a dual Arduino telemetry and control system. Can recorded flight data like altitude, pitch, yaw, and roll along with camera feed.",
    "start_date": "Dec '20",
    "end_date": "Jun '21",
    "resources": {
      "cad": "https://cad.onshape.com/documents/4e32d9f36a97adf58a6869c2/w/24def73a5e4a5848b79d8d09/e/69e1de1bbc6c503f41a5028c",
      "github": "https://github.com/AmarMaksumic/AquilaHeavy",
      "website": ""
    },
    "tags": ["Control Systems", "Rocketry", "Mechanical Engineering"]
  },
  "ML-CV": {
    "description": "Hybrid Computer Vision System coded in Python for the 2020/21 FRC game. Utilizes OpenCV algorithms alongside a Transfer Trained MobileNet SSD model for video processing and error correction. Uses Tornado and Websockets for relaying data to the robot and driver.",
    "start_date": "Mar '20",
    "end_date": "Feb '21",
    "resources": {
      "github": "https://github.com/AmarMaksumic/ML-CV"
    },
    "tags": ["Computer Vision", "Machine Learning", "IoT & Networking"]
  },
  "MerryMachine": {
    "description": "A competition entry for the 2020 Bay Area Hacks. This is a website with a Heroku Server that uses machine learning to classify news articles from various sources into sections (i.e. positive, negative, political). Each article is displayed on a card, in its appropriate section, that links to the site where the user can read the text.",
    "start_date": "Jul '20",
    "end_date": "Jan '21",
    "resources": {
      "github": "https://github.com/halihuang/Merry-Machine",
      "website": "https://halihuang.github.io/Merry-Machine/official_site/index.html"
    },
    "tags": ["Web App", "Machine Learning"]
  },
  "Aquila Lite": {
    "description": "Model rocket that collects flight data like altitude and camera feed. Introduction to rocketry and preparation for building Aquila Heavy(er).",
    "start_date": "Sep '20",
    "end_date": "Dec '20",
    "resources": {
      "cad": "https://cad.onshape.com/documents/6ce2d0160148c9bd051cd5e0/w/9f6abab1c3739a3fb5c6e2a1/e/1f2ff3f5dbbd4623a367679c",
      "github": "https://github.com/AmarMaksumic/AquilaLite"
    },
    "tags": ["Control Systems", "Rocketry", "Mechanical Engineering"]
  },
  "THHS AMA Website": {
    "description": "Website for Townsend Harris High School election simulation.",
    "start_date": "Sep '20",
    "end_date": "Nov '20",
    "resources": {
      "github": "https://github.com/AmarMaksumic/thhsama",
      "website": "https://amarmaksumic.github.io/thhsama/"
    },
    "tags": []
  },
  "Day.io": {
    "description": "A simple meeting and assignment organizer for students. Has integration for Google Calendar events and Google Classroom assignments.",
    "start_date": "Apr '20",
    "end_date": "Apr '20",
    "resources": {
      "github": "https://github.com/AmarMaksumic/SVH"
    },
    "tags": ["Application"]
  },
  "HawkEye": {
    "description": "Computer Vision System coded in Python for the 2020 FRC game. Utilizes OpenCV, Tornado, and Websockets for video processing and relaying data to the robot and driver.",
    "start_date": "Jan '20",
    "end_date": "Mar '20",
    "resources": {},
    "tags": ["Computer Vision", "IoT & Networking"]
  },
  "2018/19 Vision": {
    "description": "Computer Vision System coded in C++ for the 2018 and 2019 FRC games. Utilizes OpenCV, Gstreamer, and Network Tables for video processing and relaying data to the robot and driver.",
    "start_date": "Feb '18",
    "end_date": "May '19",
    "resources": {},
    "tags": ["Computer Vision", "IoT & Networking"]
  },
  "": {
    "description": "",
    "start_date": "",
    "end_date": "",
    "resources": {
      "cad": null,
      "github": null,
      "website": null
    },
    "tags": []
  }
}

dynamic_render()