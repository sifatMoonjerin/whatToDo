//////////////INPUT CONTROLLER MODULE//////////////


var inputController = (function() {

//function constructor for items

var Tasks = function(id, description){
    this.id = id;
    this.description = description;
}

var list = []; 


    return {
        addTask: function(des){
            var newTask, id;

            //first we need to determine the id of the input

            if(list.length > 0){
                id = list[list.length-1].id + 1;  ////id will be +1 than the last task id
            } else{
                id = 0;                           ////id will be zero if it is the first task in the list
            }

            newTask = new Tasks(id,des);  ////new task will be created using the Tasks constructor

            list.push(newTask);                   ////the new task is added to the list
            return newTask;
        },

        deleteTask: function(el){
            var newList, cut;
            newList = list.map(function(cur){               ///map all the id
                return cur.id;
            });
            cut = newList.indexOf(parseInt(el));            ///find the index of the id to remove
            list.splice(cut,1);
        },

        cleanSlate: function(){                            ////this is initiated in the beginning to make sure there is no data
            list = [];
        },

        taskList: function(){
            return list;
        },

        completedTask: {
            completed: 0
        }


    }

})();


/////////////UI CONTROLLER MODULE//////////////////


var UIController = (function(){

    var DOMstrings = {             /////Contains all the class strings
        listLabel: ".task__list",
        comLabel: ".com__task",
        totLabel: ".tot__task",
        inputLabel: ".input__field",
        addLabel: ".add__btn",
        doneLabel: ".done__btn",
        refreshLabel: ".refresh__btn",
        dayLabel: ".date__day",
        dateLabel: ".date__date",
        monthLabel: ".date__month",
        hourLabel: ".clock__hour",
        minuteLabel: ".clock__minute",
        ampmLabel: ".ampm"
    };

    var timeAdjust = function(hour, minute){                                        ////adjusts the time format
        var hr, min;
        ampmAdjust(hour);      
        if(hour === 0){
            document.querySelector(DOMstrings.hourLabel).textContent = "12";    ////at midnight
        } else {
            hr = document.querySelector(DOMstrings.hourLabel);              ////add 0 if the hour is single digit
            hour = hour > 12? (hour - 12) : hour; 
            hr.textContent = hour < 10 ? "0" + hour : hour;
        } 

        min = document.querySelector(DOMstrings.minuteLabel);
        min.textContent = minute < 10 ? "0" + minute : minute;

    };

    var ampmAdjust = function(hour){                                        ////set am or pm
        if(hour < 12){
            document.querySelector(DOMstrings.ampmLabel).textContent = " AM";
        } else{
            document.querySelector(DOMstrings.ampmLabel).textContent = " PM";
        } 
    }

    return {
        getInput: function(){                 ///////method is not necessary 
            return {
                description: document.querySelector(DOMstrings.inputLabel).value   ////gets the value from the input field
            }
        },

        displayTime: function(){
            var time, day, days, date, month, months, hour, minute;

            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            var time = new Date();
            
            month = months[time.getMonth()];
            day = days[time.getDay()];
            date = time.getDate();

            hour = time.getHours();
            minute = time.getMinutes();


            document.querySelector(DOMstrings.dayLabel).textContent = day;
            document.querySelector(DOMstrings.dateLabel).textContent = date;
            document.querySelector(DOMstrings.monthLabel).textContent = month;
            timeAdjust(hour, minute);
            
            
            setTimeout(UIController.displayTime,1000);
        },

        displayTask: function(obj){
            var taskHTML, newTaskHTML;
            taskHTML = '<li><div class="item__list"  id=%i0%><div id=%i0%><div class="item__name"><i class="ion-ios-arrow-forward"></i> %forgetJS% </div><button class="delete__btn" id="cross"><i class="ion-ios-trash" id="cross"></i></button><button class="done__btn" id="tick"><i class="ion-ios-checkmark" id="tick"></i></button></div></div></li>'
            
            newTaskHTML = taskHTML.replace("%i0%", obj.id);
            newTaskHTML = newTaskHTML.replace("%i0%", obj.id);
            newTaskHTML = newTaskHTML.replace("%forgetJS%", obj.description);
            document.querySelector(DOMstrings.listLabel).insertAdjacentHTML('beforeend', newTaskHTML);

        },

        doneTask: function(el){
            document.querySelector(DOMstrings.comLabel).textContent = el;
        },

        totalTask: function(el){
            document.querySelector(DOMstrings.totLabel).textContent = el;
        },

        removeTask: function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        cleanDisplay: function(li){
            var el;
            li.map(function(cur){
                var el = document.getElementById(cur.id);
                el.parentNode.removeChild(el);
            })
        },

        getDOMstrings: function(){
            return DOMstrings;
        }

    

    }


})();


/////////////APP CONTROLLER MODULE/////////////////


var appController = (function(inctrl, uictrl){

    var labels;
    labels = uictrl.getDOMstrings();          ////fetchs the class strings from the ui controller

    var setupEventListeners = function(){

        document.querySelector(labels.addLabel).addEventListener("click",  addTask);    ////fetch the input and add it to the list
        document.addEventListener("keypress", function(){                               ////Enables enter for entering task
            if(event.keyCode === 13){
                addTask();
            }
        });
        
        document.querySelector(labels.listLabel).addEventListener("click", crossTask);
        document.querySelector(labels.refreshLabel).addEventListener("click", clean);
        
        
    };

    var clearInputField = function(){
        document.querySelector(labels.inputLabel).value = "";                     ////clears the input field
    }

    var addTask = function(){
        var input, newIn;

        input = uictrl.getInput();                                          /////takes the input
        
        if(input.description !== ""){
            newIn = inctrl.addTask(input.description);                      /////stores it and puts an id for it
            uictrl.displayTask(newIn);                                      ////display the item in the list
            clearInputField();
        }  
        totalTask();

    }

    var deleteTask = function(id){
        inctrl.deleteTask(id);
        uictrl.removeTask(id);
        totalTask();
    }

    var doneTask = function(el){
        uictrl.doneTask(el);
        inctrl.completedTask.completed = el;
    }

    var totalTask = function(){
        uictrl.totalTask(inctrl.taskList().length);
    }

    var tickCounter = function(id,type){
        var count_task;
        ticked = document.getElementById(id).classList.contains("line__through");
        count_task = inctrl.completedTask.completed;
        if(type === "tick"){
            ticked? count_task++ : count_task--;
        } else{
            ticked? count_task-- : count_task;
        }
        doneTask(count_task);
    }


    var crossTask = function(event){
        var typeBtn, id, ticked, count_task;
        typeBtn = event.target.id;                             ////gets the id of clicked element
        id = event.target.parentNode.parentNode.id; 
        
        if(typeBtn === "tick"){                                             ///determines which button was clicked                            
            document.getElementById(id).classList.toggle("line__through");
            /*
            ticked = document.getElementById(id).classList.contains("line__through");
            count_task = inctrl.completedTask.completed;
            ticked? count_task++ : count_task--;
            doneTask(count_task);
            */
            tickCounter(id,typeBtn); 
        } else if(typeBtn === "cross"){
            /*
            ticked = document.getElementById(id).classList.contains("line__through");
            count_task = inctrl.completedTask.completed;
            ticked? count_task-- : count_task;
            doneTask(count_task);
            */
            tickCounter(id,typeBtn);
            deleteTask(id);
        }

    }

    var clean = function(){
        var li;
        li = inctrl.taskList();
        uictrl.cleanDisplay(li);
        inctrl.cleanSlate();
        doneTask(0);
        totalTask();
    }

    return{
        init: function(){
            console.log("Decide what to do.");
            clean();
            setupEventListeners();
        }
    }


})(inputController, UIController);



appController.init();
UIController.displayTime();




