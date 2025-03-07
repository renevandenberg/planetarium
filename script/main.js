
window.planetData = {'Mercury': 
                     {
                         'orbitalPeriod': 88.,
                         'orbitalPeriodLande': 87.968357,
                         'centerX': 49.6,
                         'centerY': 47.7,
                         'radius': 0.3,
                         'orbitalRadius': 1.8,
                         'orbitalOffset': 5.95748243
                     },
                     'Venus': 
                     {
                         'orbitalPeriod': 225.,
                         'orbitalPeriodLande': 224.695509,
                         'centerX': 49.4,
                         'centerY': 48.4,
                         'radius': 0.4,
                         'orbitalRadius': 3.2,
                         'orbitalOffset': 4.77634832
                     },
                     'Earth': 
                     {
                         'orbitalPeriod': 365., 
                         'orbitalPeriodLande': 365.242188,
                         'leapDayOffset': -1.,
                         'centerX': 49.4,
                         'centerY': 48.5,
                         'radius': 0.5,
                         'orbitalRadius': 4.4,
                         'orbitalOffset': 2.71951444
                     },
                     'Mars': 
                     {
                         'orbitalPeriod': 686.,
                         'orbitalPeriodLande': 686.9292,
                         'centerX': 50.5,
                         'centerY': 48.8,
                         'radius': 0.6,
                         'orbitalRadius': 6.4,
                         'orbitalOffset': 3.77674764
                     }, 
                     'Jupiter': 
                     {
                         'orbitalPeriod': 4335.,
                         'orbitalPeriodLande': 4330.3736,
                         'centerX': 51.3,
                         'centerY': 48.1,
                         'radius': 1.2,
                         'orbitalRadius': 20.2,
                         'orbitalOffset': 4.00279047
                     },
                     'Saturn': 
                     {
                         'orbitalPeriod': 10760.,
                         'orbitalPeriodLande': 10749.307,
                         'centerX': 49.5,
                         'centerY': 44.4,
                         'radius': 1.0,
                         'orbitalRadius': 37.8,
                         'orbitalOffset': 4.47604347
                     }
                    };
function init(){
    initLeapYears();
    initPlanets(); 
    updateReferenceSystem(); 
    updateInterval(); 
}
function initLeapYears () {
    window.leapYears = Array(2180 - 1776 + 1).fill(1776).map((x, y) => x + y).filter(
        (y) => ((y & 3) == 0 && ((y % 25) != 0 || (y & 15) == 0))
    );
}
function updateStats(){
    try{
        observation_time = new Date(document.getElementById('observation_time').value);
        window.numberOfDays = (observation_time.getTime())/3600./24./1000+68980.;

        window.numberOfLeapDays = (observation_time.getMonth() > 1 || (observation_time.getMonth() == 1 && observation_time.getDate() == 29)) 
            ? leapYears.filter((year) => (year <= observation_time.getFullYear())).length-2 
        : leapYears.filter((year) => (year < observation_time.getFullYear())).length-2;

        document.getElementById('numberOfDays').value = Math.floor(window.numberOfDays);
        document.getElementById('numberOfLeapDays').value = window.numberOfLeapDays;
    }
    catch(e){
        document.getElementById('numberOfDays').value = '-';
        document.getElementById('numberOfLeapDays').value = '-';
    }
}


function updateInterval(){
    updateStats();
    s = document.getElementById('speed');
    window.speed = parseInt(s.options[s.selectedIndex].value);

    if( window.dateTimeLocalInterval != undefined){
        clearInterval(window.dateTimeLocalInterval);
    }

    if(window.speed > 0){
        window.dateTimeLocalInterval = setInterval(function(){
            document.getElementById('observation_time').stepUp(Math.max(window.speed/1000,1));
            updateOrbits();
        },Math.max(60000/window.speed,60));
    }
}
function initPlanets(){
    for(const name in window.planetData){
        planet = window.planetData[name];
        circle = document.getElementById(name);
        title = document.createElement('title');
        circle.append(title);
        circle.setAttribute('r', planet.radius + '%');
        circle.setAttribute('fill', 'url(#planet-shadow)');
    }
}
function updateOrbits(){
    updateStats();
    for(const name in window.planetData){
        planet = window.planetData[name];
        circle = document.getElementById(name);
        switch(window.referenceSystem){
            case 'de-lalande':
                rotation = 2 * Math.PI * (window.numberOfDays) / planet.orbitalPeriodLande + planet.orbitalOffset;
                break;
            default:
                rotation = 2 * Math.PI * (window.numberOfDays + (planet.leapDayOffset || 0)*window.numberOfLeapDays) / planet.orbitalPeriod + planet.orbitalOffset;
                break;
        }
        rotation += 2. * Math.PI * 270./365.;
        circle.setAttribute('cx', (planet.centerX + planet.orbitalRadius*Math.sin(rotation)) + '%');
        circle.setAttribute('cy', (planet.centerY + planet.orbitalRadius*Math.cos(rotation)) + '%');
        circle.setAttribute('transform', 'rotate('+(-rotation * 180 / Math.PI)+')');
        circle.setAttribute('transform-origin', circle.getAttribute('cx') + ' ' + circle.getAttribute('cy'));
    }
}
function updateReferenceSystem(){
    rf = document.getElementById('reference_system');
    window.referenceSystem = rf.options[rf.selectedIndex].value;
    updateOrbits();
}
function setObservationTime(observation_time){
    document.getElementById('observation_time').value=observation_time; 
    setSpeed('1');
    updateOrbits();
}
function setSpeed(speed){
    document.getElementById('speed').value = speed;
    updateInterval();
}
function setReferenceSystem(reference_system){
    document.getElementById('reference_system').value=reference_system;
    updateOrbits();
}
function updateColor(hex){
    document.body.style.background = document.getElementById('color').value;
}