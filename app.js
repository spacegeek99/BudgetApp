
//Budget Controller
var budgetController = (function() {
      //some code

      var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value; 
        this.percentages = -1;
      };

      Expense.prototype.calcPercentages = function(totalIncome) {
        if(totalIncome > 0) {
        this.percentages = Math.round((this.value / totalIncome) * 100);   
      } else {
        this.percentage = -1; 
      }
    };

    Expense.prototype.getPercentage = function() {
      return this.percentages;
    }

      var Income = function(id, description, value) {
        this.id = id;
        this.description = description; 
        this.value = value;
      }; 

      var allExpenses = [];
      var allIncomes = [];
      var totalExpenses = 0;

      var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) { 

          sum = sum + cur.value;

        });
        console.log(sum);
      
        data.totals[type] = sum;
      };

      var data = {
        allItems: {
          exp: [],
          inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        },
        budget: 0,
        percentage: -1
      };

      return {
        addItems: function(type, des, val){

          var newItem, ID;
          
          //[1,2,3,4,5], next ID = 6
          //[1 2 4 6 8], nextID = 9
          // ID = last ID + 1
          
          //create new id
          if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          }
           else{
             ID = 0;
           }
              


          if(type === 'exp'){
            newItem = new Expense(ID, des, val)
          
          }
          else if(type === 'inc') {

            newItem = new Income(ID, des, val)
          
          }
          //push it into data structure
          data.allItems[type].push(newItem);

          //return the new element
          return newItem;

        },

        deleteItem: function(type, id) {

          var ids, index;
            // id = 3
            //data.allitem[type][id];

            //[1 2 4 6 8]
            //index = 
            
           ids = data.allItems[type].map(function(current) {
              return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
          
          },
        calculateBudget: function(){
         //calculate total income and expenses
         calculateTotal('exp');
         calculateTotal('inc');

         //calculate the budget: income - expenses
         data.budget = data.totals.inc - data.totals.exp;

         //calculate the percentage of income that we spent
         if( data.totals.inc > 0) {
           data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
         }
         else {
           data.percentage = -1;
         }
        },

        calculatePercentages: function() {

          data.allItems.exp.forEach(function(cur) {
            cur.calcPercentages(data.totals.inc);
          })
        },

        getPercentage: function() {
          var allPerc = data.allItems.exp.map(function(cur) { 
            return cur.getPercentage();

          });
          return allPerc;
        },

        getBudget: function() {
          return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
          };
        },
        testing: function() {
          console.log(data);
        }
      }



 })();

 var Expense = function(id, description, value) {
  this.id = id;
  this.description = description,
  this.value = value 
};



//UI Controller





var UIController = (function() {
  // some code

  

  var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            ExpenseContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLable: '.budget__expenses--percentage',
            container: '.container',
            expensesPerceLabel: '.item__percentage'


        };
        return {
          getInput: function() {

            return {
               type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
          },
          addListItem: function(obj, type) {
             var html, newhtml, element;
            //create HTMl strings with placeholder text
            if(type === 'inc'){
              element = DOMstrings.incomeContainer;
              html =  '<div class="item clearfix" id="inc-%id"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            else if(type === 'exp') {
              element = DOMstrings.ExpenseContainer
              html = '<div class="item clearfix" id="exp-%id"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace the placeholder text with some actual data
            newhtml = html.replace('%id', obj.id);
            newhtml = newhtml.replace('%description', obj.description);
            newhtml = newhtml.replace('%value', obj.value); 
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
          },

          deleteItemList: function(SelectorId) {

            var el = document.getElementById(SelectorId);
            el.parentNode.removeChild(el);

          },

          clearFields: function() {
            var fields, fieldArr;
          fields = document.querySelectorAll(DOMstrings.inputDescription + ' , ' + 
            DOMstrings.inputValue)
           fieldArr = Array.prototype.slice.call(fields);

             fieldArr.forEach(function(current, index, array) {

                current.value = "";

            });

            fieldArr[0].focus();


          },

          displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent =  obj.totalExp;
            document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage;

            if(obj.percentage > 0)
            {
              document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage;
            }
            else {
              document.querySelector(DOMstrings.percentageLable).textContent = "---";
            }

          },
          
          displayPercentages: function(percentages) {

            console.log("in display");
            
            var fields = document.querySelectorAll(DOMstrings.expensesPerceLabel);

            var nodeListForEach = function(list, callback) {
              for(var i=0; i < list.length; i++) {
                  callback(list[i], i);
              }            
          };
            
          nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                  console.log("in display@")
                  document.querySelectorAll(DOMstrings.expensesPerceLabel).textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
          
          getDOMstrings: function() {
            return DOMstrings;
          }
          
        
        };



  })();


    //Global UI Controller
  var controller = (function(budgetCtrl, UICtrl) {
           //some code

           var setupEventListners =  function() {
            var DOM = UICtrl.getDOMstrings();


            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlADDItem);

            document.addEventListener('keypress', function(event) {
                if(event.keyCode === 13 || event.which === 13) {
                    ctrlADDItem();
                }
              });
              
              document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

            };

            var updateBudget = function() {
               //1. Calculate the budget
                 budgetCtrl.calculateBudget();

               //2. Return the budget

               var budget = budgetCtrl.getBudget(); 

               
               //3.Display the budget on the UI
             UICtrl.displayBudget(budget);
            };

            var updatePerecentages = function() {

              //1. calculate the percentages
              budgetCtrl.calculatePercentages();

              //2. Read percentages from the budget5 controller
               var percentages = budgetCtrl.getPercentage();

              //3. Update the UI with the new percentages
              console.log(percentages);
              UICtrl.displayPercentages(percentages);

            };


          var ctrlADDItem = function() {
              var input, newItem;
               var input = UICtrl.getInput();

              if(input.description!== "" && !isNaN(input.value) && input.value > 0) {
                //1. Get the field input data
                var input = UICtrl.getInput();
                console.log(input);

             //2.Add the item to budget controller

             newItem = budgetCtrl.addItems(input.type, input.description, input.value);

             //3. Add  the item to UI
             UICtrl.addListItem(newItem, input.type);

             //4. clear the fields
              UICtrl.clearFields();
              //5. calculate the budget
              updateBudget();
              //.Display the budget on UI

              // 7. calculate and upadate the percentages
              updatePerecentages();
              }

           };

           var ctrlDeleteItem = function(event) {
             var ItemID, splitID, type, ID;

            ItemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
           

            if(ItemID) {

              //inc-1 
              splitID = ItemID.split('-');
              type = splitID[0];
              ID = parseInt(splitID[1]);

              //1. delete the item from data structure

              budgetCtrl.deleteItem(type, ID);

              //2. delete the item from UI
              UICtrl.deleteItemList(ItemID);
              
              //3. update the new budget
              updateBudget();
              // 4. calculate and upadate the percentages
              updatePerecentages();
            
            }

           }

           return {
             init: function() {
                console.log('Application has started');
                UICtrl.displayBudget({
                  budget: 0,
                  totalInc: 0,
                  totalExp: 0,
                  percentage: -1
                 });
                setupEventListners();
             }
           };           

  })(budgetController, UIController);


  controller.init();
