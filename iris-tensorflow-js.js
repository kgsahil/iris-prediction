
var trainingData,outputData,model,testingData,chart,ctx;

 outputData = tf.tensor2d(iris.map(item => [
  item.species === "setosa" ? 1 : 0,
  item.species === "virginica" ? 1 : 0,
  item.species === "versicolor" ? 1 : 0,
]))
 


//helpers
function startTraining(){

  //prepare training data
  let selectedFeatures = []
  let epochs = $('#epochs')[0].valueAsNumber
  let children  = $('.featureForm').children()
  for(var i = 0;i < children.length;i++){
    if(children.eq(i).find('input')[0].checked)
    selectedFeatures.push(children.eq(i).find('span').html());
  }
 
  let trainArray= []
  iris.forEach(item=>{
    let single = []
    selectedFeatures.forEach(i=>{
      single.push(item[i])
    })
    trainArray.push(single)
  })
  trainingData = tf.tensor2d(trainArray)

  // let testArray= []
  // irisTesting.forEach(item=>{
  //   let single = []
  //   selectedFeatures.forEach(i=>{
  //     single.push(item[i])
  //   })
  //   testArray.push(single)
  // })
  // testingData = tf.tensor2d(testArray)

  //setting up model
  model = tf.sequential()

  model.add(tf.layers.dense({
    inputShape: [selectedFeatures.length],
    activation: "sigmoid",
    units: 5,
  }))
  model.add(tf.layers.dense({
    inputShape: [5],
    activation: "sigmoid",
    units: 3,
  }))
  model.add(tf.layers.dense({
    activation: "sigmoid",
    units: 3,
  }))
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(.06),
  })

  //train
  model.fit(trainingData, outputData, {epochs: epochs})
  .then((history) => {
    console.log(history.history.loss)
  let lossIndex = [...Array(history.history.loss.length).keys()]

     ctx = document.getElementById('myChart').getContext('2d');
     if(chart)
       chart.destroy()
       chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
      
        // The data for our dataset
        data: {
            labels: lossIndex,
            datasets: [{
                label: 'LOSS',
                borderColor: 'rgb(255, 99, 132)',
                data: history.history.loss
            }]
        },
      
        // Configuration options go here
        options: {
          responsive:true
        }
        
    });




  })


}


function featureClick(ele){
  let featureText = ele.innerHTML
  let featuredata = iris.map(item=>item[featureText])
  let featureIndex = [...Array(featuredata.length).keys()]
  let sum = summetion(featuredata)
  let min  = Math.min.apply(0,featuredata)
  let max  = Math.max.apply(0,featuredata)
  let avg = sum/featuredata.length
  let stdDev =  standardDeviation(featuredata)

  $('.featureinfo').html(`sum: ${sum}  min: ${min} max: ${max}  avg: ${avg}  stdDev: ${stdDev}`)
       ctx = document.getElementById('myChart').getContext('2d');
       if(chart)
       chart.destroy()
       chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
      
        // The data for our dataset
        data: {
            labels: featureIndex,
            datasets: [{
                label: featureText,
                borderColor: 'rgb(255, 99, 132)',
                data: featuredata
            }]
        },
      
        // Configuration options go here
        options: {}
        
    });
}

function loadDataset(){
  $('.featureForm').empty()

  let feature = Object.keys(iris[0])
  let col = feature.length
  let rows = iris.length

  feature.forEach(f=>{
    $('.featureForm').append(`<p>
    <label>
      <input type="checkbox" class="filled-in"  />
    <span onclick="featureClick(this)">${f}</span>
    </label>
  </p>`)
  if(f === 'species')
  $('.outputselect').append(`<option value="${f}">${f}</option>`)
  })
  $('.featureCon').append(`<h5>Instances: ${rows}</h5><h5>features: ${col}</h5>`)
  $('select').formSelect();

}

function standardDeviation(values){
  var avg = average(values);
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev
}
function summetion(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
  return sum
}
function average(data){
  let sum  = summetion(data)
  var avg = sum / data.length;
  return avg;
}