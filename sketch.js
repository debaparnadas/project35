//Create variables here
  var dog;
  var dogImage, dogImage1;
  var database;
  var foodS, foodStock;
  var feed, addFood;
  var fedTime, lastFed;
  var foodObj;

function preload() {
  //load images here
    dogImage = loadImage("images/dogImg.png");
    dogImage1 = loadImage("images/dogImg1.png");
}

function setup() {
  //assigning variable to database
    database = firebase.database();

  //creating canvas
    createCanvas(700,700);

  //object for Food class
    foodObj = new FoodStock ();

  //fetching the value of food from database
    foodStock=database.ref('Food');
    foodStock.on("value",readStock);  

  //creating buttons for feeding the dog and adding food
    feed = createButton("Feed the Dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood = createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods); 
  
  //creating dog sprite
    dog = createSprite(550,500,10,10);
    dog.addImage(dogImage);
    dog.scale = 0.3;
}

function draw() {  
  //background colour
    background(46,139,87);

  //reading the last fed time
    fedTime = database.ref('FeedTime');
    fedTime.on("value",function(data) {
      lastFed = data.val();
    })

  //display Food object
  foodObj.display();  

  //drawing sprites  
    drawSprites();

  //text
    fill(255,255,254);
    textSize(15);
    if(lastFed>=12){
      text("Last Fed : "+ lastFed%12 + " PM", 350,30);
    }else if(lastFed==0){
      text("Last Fed : 12 AM",350,30);
    }else{
      text("Last Fed : "+ lastFed + " AM", 350,30);
    }  

}

//function for reading the value of food from database
  function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }  

//function for feeding the dog  
  function feedDog() {
    dog.addImage(dogImage1);

    if(foodObj.getFoodStock()<= 0){
      foodObj.updateFoodStock(foodObj.getFoodStock()*0);
    }else{
      foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    }

    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }

//function for adding food  
  function addFoods() {
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }
