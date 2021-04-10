let population = [];
let bestScore = 0;
let step = 0;
let initialPop = 3;
let selectionOutput = 3;
let spaceSize = 12; 
let mutationProbability = 0.05;

function initialize_population() {
  return _.range(initialPop).map(() => _.range(spaceSize).map(() => Math.round(Math.random())))
}
function fitness(individual) {
  return _.reverse(_.clone(individual)).reduce((acc, el, idx) => acc +(el * (2**idx)))
}
function selection(population) {
  return _.slice(_.sortBy(population, (ind) => - fitness(ind)), 0, selectionOutput);
}
function crossOver(a, b) {
  return _.concat(_.slice(a, 0, spaceSize/2), _.slice(b, spaceSize/2, spaceSize))
}
function crossPhase(population) {
  return population.reduce((acc, el, idx) => _.concat(acc, population.map(element => crossOver(el, element))), [])
}
function mutation(individual) {
  return individual.map(genom => Math.random() < mutationProbability ? 1 - genom : genom)
}
function mutationPhase(population) {
  return population.map(individu => mutation(individu))
}
function transforIndToStr(individual){
  return individual.reduce((acc, el) => acc+el, "")
}
function displayPopulation(population, id){
  let element = document.getElementById(id);
  element.innerHTML = population.reduce((acc, el) => acc + transforIndToStr(el) + "<br/>", "")
}
function getBestScore(population){
  return fitness(_.maxBy(population, (ind) => fitness(ind)))
}
function displayBestScore(score, id){
  let element = document.getElementById(id);
  if(score !== undefined){
    element.innerHTML = "<b> Step: " + step + "</b><b> Best Score: " + score + "</b>";
  } else {
    element.innerHTML = "";
  }
}
function switchBtn(btn){
  inibtn.disabled = !(btn === selbtn && step === 0);
  selbtn.disabled = !(btn === selbtn);
  cobtn.disabled = !(btn === cobtn);
  mutbtn.disabled = !(btn === mutbtn);
}

let inibtn = document.getElementById("ini");
let selbtn = document.getElementById("sel");
let cobtn = document.getElementById("c-o");
let mutbtn = document.getElementById("mut");
let nxtbtn = document.getElementById("next");
let refbtn = document.getElementById("refresh");
let iniInp = document.getElementById("iniPopSize");
let selInp = document.getElementById("selPopSize");
let genInp = document.getElementById("nbGenoms");
let probInp = document.getElementById("probMut");

function init(){
  inibtn.disabled = false;
  selbtn.disabled = true;
  cobtn.disabled = true;
  mutbtn.disabled = true;
  iniInp.value = initialPop;
  selInp.value = selectionOutput;
  genInp.value = spaceSize;
  probInp.value = mutationProbability;
}

init();

inibtn.onclick = function(){
  population = initialize_population()
  bestScore = getBestScore(population);
  displayPopulation(population, "generation")
  displayBestScore(bestScore, "best")
  switchBtn(selbtn)
}
selbtn.onclick = function(){
  population = selection(population);
  displayPopulation(population, "selection")
  switchBtn(cobtn)
}
cobtn.onclick = function(){
  population = crossPhase(population);
  displayPopulation(population, "cross")
  switchBtn(mutbtn)
}
mutbtn.onclick = function(){
  population = mutationPhase(population);
  displayPopulation(population, "generation")
  bestScore = getBestScore(population);
  step = step + 1;
  displayPopulation(population, "generation")
  displayPopulation([], "selection")
  displayPopulation([], "cross")
  displayBestScore(bestScore, "best")
  switchBtn(selbtn)
}
nxtbtn.onclick = function(){
  if(!mutbtn.disabled){
    return mutbtn.click()
  }
  if(!cobtn.disabled){
    return cobtn.click()
  }
  if(!selbtn.disabled){
    return selbtn.click()
  }
  if(!inibtn.disabled){
    return inibtn.click()
  }
}
refbtn.onclick = function(){
  initialPop = iniInp.value;
  selectionOutput = selInp.value;
  spaceSize = genInp.value; 
  mutationProbability = probInp.value;
  population = [];
  bestScore = 0;
  step = 0;
  init();
  displayPopulation([], "generation")
  displayPopulation([], "selection")
  displayPopulation([], "cross")
  displayBestScore(undefined, "best")
}