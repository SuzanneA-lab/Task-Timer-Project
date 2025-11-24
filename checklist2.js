//// Checklist code starts here
//
//
//

const challenge1 = document.getElementById("ctext1");
const challenge2 = document.getElementById("ctext2");
const challenge3 = document.getElementById("ctext3");

const progress1 = document.getElementById("p1");
const progress2 = document.getElementById("p2");
const progress3 = document.getElementById("p3");

let ProgressChecker = null;

class Task {
    constructor(enteredtask, enteredtasknum) {
        this.task = enteredtask;
        this.tasknum = enteredtasknum;
        this.numtaskdone = 0;
    }

    
    ResetProgress(){
        this.numtaskdone = 0;
    }
    

    UpdateProgress(){
    }
}

class StudyTask extends Task {
    constructor(enteredtask, enteredtasknum, enteredtasktype, enteredchallengenum){
        super(enteredtask, enteredtasknum);
        this.tasktype = enteredtasktype;
        this.challengenum = enteredchallengenum;
    }

    UpdateProgress(){
        let storagelocation;
        let TimerSessions;
        let TimerSessionsint = 0;
        let tasksdone = this.numtaskdone;

        if (this.tasktype == "study"){
            storagelocation = "study_sessions".concat(this.challengenum); 
        }

        else {
            storagelocation = "break_sessions".concat(this.challengenum); 
        }

        TimerSessions = localStorage.getItem(storagelocation);

        if (TimerSessions == null){
            TimerSessions = 0;
        }

        TimerSessionsint = parseInt(TimerSessions);

        if (tasksdone != TimerSessionsint){
            this.numtaskdone = tasksdone + TimerSessionsint;
        }
    }

    ResetProgress(){
        if (this.tasktype == "study"){
            localStorage.setItem("study_sessions".concat(this.challengenum), 0);
        }
        
        else {
            localStorage.setItem("break_sessions".concat(this.challengenum), 0);
        }

        super.ResetProgress();
    }
}

class ChangeTask extends Task{
    constructor(enteredtask, enteredtasknum, entereditemtype){
        super(enteredtask, enteredtasknum);
        this.itemtype = entereditemtype;
        this.storagelocation = this.itemtype + "change";
    }

    UpdateProgress(){
        let numequips = 0;

        if (localStorage.getItem(this.storagelocation) != null){
            numequips = parseInt(localStorage.getItem(this.storagelocation));
        }

        this.numtaskdone = this.numtaskdone + numequips;
    }

    ResetProgress(){
        localStorage.setItem(this.storagelocation, 0);
        super.ResetProgress();
    }
}

class EarnTask extends Task{
    constructor(enteredtask, enteredtasknum){
        super(enteredtask, enteredtasknum);
        
        if (localStorage.getItem("initialcoins") == null){
            let initialcointotal = localStorage.getItem("coins");
            localStorage.setItem("initialcoins", initialcointotal);
        }
    }

    UpdateProgress(){
        let oldcointotal = parseInt(localStorage.getItem("initialcoins"));
        let newcointotal = parseInt(localStorage.getItem("coins"));
        let amountearned = 0;

        if (oldcointotal < newcointotal){
            amountearned = newcointotal - oldcointotal;
            this.numtaskdone = this.numtaskdone + amountearned;
        }

        else if (oldcointotal > newcointotal){
            localStorage.setItem("initialcoins", newcointotal);
        }
    }

    ResetProgress(){
        let initialcointotal = localStorage.getItem("coins");
        localStorage.setItem("initialcoins", initialcointotal);
        
        super.ResetProgress();  
    }
}

class BuyTask extends Task{
    constructor(enteredtask, enteredtasknum){
        super(enteredtask, enteredtasknum);
        
        if (localStorage.getItem("initialcoins2") == null){
             let initialcointotal = localStorage.getItem("coins");
            localStorage.setItem("initialcoins2", initialcointotal);       
        }
    }

    UpdateProgress(){
        let oldcointotal = parseInt(localStorage.getItem("initialcoins2"));
        let newcointotal = parseInt(localStorage.getItem("coins"));
        let amountspent = 0;

        if (oldcointotal > newcointotal){
            amountspent = oldcointotal - newcointotal;
            this.numtaskdone = this.numtaskdone + amountspent;
        }

        else if (oldcointotal < newcointotal){
            localStorage.setItem("initialcoins2", newcointotal);
        }
    }

    ResetProgress(){
        let initialcointotal = localStorage.getItem("coins");
        localStorage.setItem("initialcoins2", initialcointotal);

        super.ResetProgress();  
    }
}

class TaskUpdater {
    constructor(enteredTaskobj, enteredCoinrewards, enteredChallengename, enteredProgressname){
        this.Taskobj = enteredTaskobj;
        this.Coinrewards = enteredCoinrewards;
        this.Challengename = enteredChallengename;
        this.Progressname = enteredProgressname;
        this.Taskcomplete = false;
    }

    UpdateDisplay(){
        this.Challengename.textContent = this.Taskobj.task;
        this.Progressname.textContent = this.Taskobj.numtaskdone + "/" + this.Taskobj.tasknum;
    }

    CheckandUpdateTasks(){
        this.Taskobj.UpdateProgress();
        this.UpdateDisplay();

        if (this.Taskobj.numtaskdone >= this.Taskobj.tasknum){
            if (ProgressChecker != null){
                clearInterval(ProgressChecker);
            }

            this.CompleteChallenge();
        }
    }

    RunChallenge(){
        this.UpdateDisplay();
        ProgressChecker = setInterval(this.CheckandUpdateTasks.bind(this), 30000);
    }

    CompleteChallenge(){
        let theme = localStorage.getItem("theme");
        let accent = localStorage.getItem("accent");
        let midtone = localStorage.getItem("midtone");

        this.Progressname.textContent = "✓";
        this.Progressname.classList.add('progresscomplete');

        this.Taskcomplete = true;
    }

    StartNewTask(enteredTaskobj, enteredCoinrewards){
        if (this.Taskcomplete){
            this.Taskcomplete = false;
            this.Taskobj = enteredTaskobj;
            this.Coinrewards = enteredCoinrewards;

            this.Taskobj.ResetProgress();
            this.UpdateDisplay();

            this.Progressname.classList.remove('progresscomplete');
        }
    }

    ClaimRewards(newTaskobj){
        this.Taskcomplete = false;
    }
}

const ST1 = new StudyTask("Use the Study Timer for 10 minutes", 10, "study", 1);
const ST2 = new StudyTask("Use the Study Timer for 15 minutes", 15, "study", 2);
const ST3 = new StudyTask("Use the Study Timer for 20 minutes", 20, "study", 3);

const BR1 = new StudyTask("Use the Break Timer for 10 minutes", 10, "break", 1);
const BR2 = new StudyTask("Use the Break Timer for 15 minutes", 15, "break", 2);
const BR3 = new StudyTask("Use the Break Timer for 20 minutes", 20, "break", 3);

const CB1 = new ChangeTask("Change the Background theme 1 time", 1, "background"); 

const ET1 = new EarnTask("Earn 10 coins by completing challenges", 10);
const ET2 = new EarnTask("Earn 20 coins by completing challenges", 20);

const BT1 = new BuyTask("Purchase 1 item in the shop", 1);
const BT2 = new BuyTask("Spend at least 75 coins in the shop", 75);

/*testing tasks
const ST4 = new StudyTask("Use the study timer for 1 minute", 1, "study", 1);
const ST5 = new StudyTask("Use the break timer for 2 minutes", 2, "break", 1);
const ST6 = new StudyTask("Use the study timer for 3 minutes", 3, "study", 1);
const TT1 = new StudyTask("Tester", 0, "study", 1);
*/

let Updater10;
let Updater15;
let Updater20;

const tasks10 = [BR1,ST1,CB1];
const tasks15 = [ST2,ET1,BR2,BT1];
const tasks20 = [ET2,BR3,ST3,ET2,BT2];

function TaskCheckandSet(taskcategory, listlength){
    currentTask = localStorage.getItem(taskcategory);
    
    if (currentTask == null || parseInt(currentTask) >= listlength){
        localStorage.setItem(taskcategory, 0);
    }
}

function LoadChallenges(){
    //checks if there are existing challenges stored, if not adds new ones

    TaskCheckandSet("tasks10", tasks10.length);
    TaskCheckandSet("tasks15", tasks15.length);
    TaskCheckandSet("tasks20", tasks20.length);

    //creates variables to represent the indexes of task items within their respective lists
    let current10 = parseInt(localStorage.getItem("tasks10"));
    let current15 = parseInt(localStorage.getItem("tasks15"));
    let current20 = parseInt(localStorage.getItem("tasks20"));

    Updater10 = new TaskUpdater(tasks10[current10], 10, challenge1, progress1);
    Updater15 = new TaskUpdater(tasks15[current15], 15, challenge2, progress2);
    Updater20 = new TaskUpdater(tasks20[current20], 20, challenge3, progress3);
    
    Updater10.CheckandUpdateTasks();
    Updater15.CheckandUpdateTasks();
    Updater20.CheckandUpdateTasks();
}

function GetReward(id){
    if (id == "p1"){
        Updater = Updater10;
        tasklist = tasks10;
        tasklistname = "tasks10"; 
    }

    else if (id == "p2"){
        Updater = Updater15;
        tasklist = tasks15;
        tasklistname = "tasks15"; 
    }

    else {
        Updater = Updater20;
        tasklist = tasks20;
        tasklistname = "tasks20"; 
    }

    if (Updater.Taskcomplete){
        let Reward = Updater.Coinrewards;
        let storedcoins = parseInt(localStorage.getItem("coins"));   
        
        let totalcoins = Reward + storedcoins;
        localStorage.setItem("coins", totalcoins);

        coindisplaynum.textContent = String(totalcoins).padStart(3,"0");

        let old10 = localStorage.getItem(tasklistname);
        let new10 = parseInt(old10) + 1;
        let len = tasklist.length;

        if ( new10 == len ){
            new10 = 0;
        }

        localStorage.setItem(tasklistname, new10);

        Updater.StartNewTask(tasklist[new10], Reward);
        Updatealltasks();
    }
}

function Updatealltasks(){
    Updater10.CheckandUpdateTasks();
    Updater15.CheckandUpdateTasks();
    Updater20.CheckandUpdateTasks();
}

function TaskSkip(){
    let oldtaskindex1 = parseInt(localStorage.getItem("tasks10")); 
    let oldtaskindex2 = parseInt(localStorage.getItem("tasks15")); 
    let oldtaskindex3 = parseInt(localStorage.getItem("tasks20"));
    
    let newtaskindex1 = SetNextTask("tasks10", tasks10.length);
    let newtaskindex2 = SetNextTask("tasks15", tasks15.length);
    let newtaskindex3 = SetNextTask("tasks20", tasks20.length);

    let newtask1 = tasks10[newtaskindex1];
    let newtask2 = tasks15[newtaskindex2];
    let newtask3 = tasks20[newtaskindex3];

    Updater10.Taskcomplete = true;
    Updater10.StartNewTask(newtask1, newtask1.Reward);

    Updater15.Taskcomplete = true;
    Updater15.StartNewTask(newtask2, newtask2.Reward);

    Updater20.Taskcomplete = true;
    Updater20.StartNewTask(newtask3, newtask3.Reward);
}

function SetNextTask(taskcategory, listlength){
    currentTask = parseInt(localStorage.getItem(taskcategory));
    let newindex = 0;
    
    if (currentTask == null || isNaN(currentTask) || currentTask >= listlength-1){
        console.log(currentTask, listlength);
        localStorage.setItem(taskcategory, 0);
    }

    else {
        localStorage.setItem(taskcategory, currentTask+1);
        newindex = currentTask+1;
    }

    return newindex;
}

//// Code for all pages
//
//
//

const display = document.getElementById("clock")
const sidebar = document.querySelector('.menu');
const popuphelp = document.getElementById("popupbghelp");
const popupsettings = document.getElementById("popupbgsettings");
const coindisplaynum = document.getElementById("numcoins");

const studylengthtextbox = document.getElementById("Slengthtextbox");
const Sbreaklengthtextbox = document.getElementById("SBlengthtextbox");
const Lbreaklengthtextbox = document.getElementById("LBlengthtextbox");

const SfxSwitch = document.getElementById("sfxswitch");
const AutoSwitch = document.getElementById("autoswitch"); 

const root = document.documentElement;
const cover = document.getElementById('cover');

let soundon = true;
let autorun = true;

window.onload = Load();

let loaded = false;

window.addEventListener("DOMContentLoaded", function(){
    loaded = true;

    if (loaded){
        cover.addEventListener( "animationend", function(){
            cover.style.visibility = "hidden";
        });
    }
});

function Load(){
    let theme = localStorage.getItem("theme");
    let accent = localStorage.getItem("accent");
    let midtone = localStorage.getItem("midtone");
    let bg = localStorage.getItem("Background");
    
    let storedcoins = localStorage.getItem("coins");
    
    let sfxsetting = localStorage.getItem("SFX");
    let autorunsetting = localStorage.getItem("Autorun");
    
    let studylength = localStorage.getItem("Studylen"); 
    let longbreaklength = localStorage.getItem("Lbreaklen");
    let shortbreaklength = localStorage.getItem("Sbreaklen");

    if (theme === null || bg === null || accent == null || storedcoins == null || sfxsetting == null || studylength == null || longbreaklength == null || shortbreaklength == null){
        theme = "white";
        accent = "#0a0f72";
        midtone = "#060947";
        bg = "url(Stars.png)";
        storedcoins = "0";
        sfxsetting == "true";
        autorunsetting = "true";
        
        studylength = "25";
        longbreaklength = "10";
        shortbreaklength = "5";

        localStorage.setItem("theme", "white");
        localStorage.setItem("accent", "#0a0f72");
        localStorage.setItem("midtone", "#060947");
        localStorage.setItem("Background", "url(Stars.png)");

        localStorage.setItem("coins", 0);

        localStorage.setItem("SFX", true);
        localStorage.setItem("Autorun", true);

        localStorage.setItem("Studylen", "25");
        localStorage.setItem("Lbreaklen", "10");
        localStorage.setItem("Sbreaklen", "5");
    }

    root.style.setProperty('--theme', theme);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--midtone', midtone);
    root.style.setProperty('--background', bg);

    if (sfxsetting == "false"){
        SfxSwitch.checked = true;
    }

    if (autorunsetting == "false"){
        AutoSwitch.checked = true;
    }

    studylengthtextbox.value = studylength;
    Sbreaklengthtextbox.value = shortbreaklength;
    Lbreaklengthtextbox.value = longbreaklength;
    
    coindisplaynum.textContent = storedcoins.padStart(3,"0");
    LoadChallenges();
}

let menuopened = false;
const menucover = document.getElementById("menucover");

function Openmenu(){
    menuopened = true;
    sidebar.style.display = 'flex';
    menucover.style.display = 'flex';

    sidebar.style.animationName="menuslidein";
    menucover.style.animationName="menuslidein";
}

function Closemenu(){
    menuopened = false;
    sidebar.style.animationName="menuslideout";
    menucover.style.animationName="menuslideout";

    sidebar.addEventListener( "animationend", function(){
        if (!menuopened) {
            sidebar.style.display = 'none';
        }
    });

    menucover.addEventListener( "animationend", function(){
        if (!menuopened) {
            menucover.style.display = 'none';
        }
    });
}

let helpopened = false;
let settingsopened = false;

function Closehelp(){
    helpopened = false;
    popuphelp.style.animationName = 'menuslideout';

    popuphelp.addEventListener( "animationend", function(){
        if (!helpopened) {
            popuphelp.style.display = 'none';
        }
    });
}

function Openhelp(){
    helpopened = true;
    popuphelp.style.animationName = 'menuslidein';
    popuphelp.style.display = 'flex';
}

function CloseSettings(){
    settingsopened = false;
    popupsettings.style.animationName = 'menuslideout';

    popupsettings.addEventListener( "animationend", function(){
        if (!settingsopened) {
            popupsettings.style.display = 'none';
        }
    });

    let studynum = studylengthtextbox.value;
    let Sbreaknum = Sbreaklengthtextbox.value;
    let Lbreaknum = Lbreaklengthtextbox.value; 
    
    if (studynum != localStorage.getItem("Studylen")) {
        if (!isNaN(studynum) && studynum != "0" && studynum != "00" && studynum != "e" && studynum != "++"  && studynum != "+-"  && studynum != "-+"  && studynum != "--" && studynum != null && studynum != ""){
            localStorage.setItem("Studylen", studylengthtextbox.value);
        }

        else{
            studylengthtextbox.value = "25";  
            localStorage.setItem("Studylen", "25"); 
        }
    }

    if (Sbreaknum != localStorage.getItem("Sbreaklen")) {
        if (!isNaN(Sbreaknum) && Sbreaknum != "0" && Sbreaknum != "00" && Sbreaknum != "e" && Sbreaknum != "++"  && Sbreaknum != "+-"  && Sbreaknum != "-+"  && Sbreaknum != "--" && Sbreaknum != null && Sbreaknum != ""){
            localStorage.setItem("Sbreaklen", Sbreaklengthtextbox.value);
        }

        else{
            Sbreaklengthtextbox.value = "5";  
            localStorage.setItem("Sbreaklen", "5"); 
        }
    }

    if (Lbreaknum != localStorage.getItem("Lbreaklen")) {
        if (!isNaN(Lbreaknum) && Lbreaknum != "0" && Lbreaknum != "00" && Lbreaknum != "e" && Lbreaknum != "++"  && Lbreaknum != "+-"  && Lbreaknum != "-+" && Lbreaknum != "--" && Lbreaknum != null && Lbreaknum != ""){
            localStorage.setItem("Lbreaklen", Lbreaklengthtextbox.value);
        }

        else{
            Lbreaklengthtextbox.value = "10";  
            localStorage.setItem("Lbreaklen", "10"); 
        }
    }

}

function OpenSettings(){
    settingsopened = true;
    popupsettings.style.animationName = 'menuslidein';
    popupsettings.style.display = 'flex';
}

const popuprestart= document.getElementById("popuprestart");
const rspopupwindow = document.getElementById("restartbox");
const rspopupprompt = document.getElementById("restartprompt");
const restartbutton = document.getElementById("restartbutton");
const dontrestartbutton = document.getElementById("dontrestartbutton")

function OpenRestart(){
    popuprestart.style.display = 'flex';
    restartbutton.style.display = 'flex';
    rspopupwindow.style.width = "850px";
}

function commitRestart(){
    popuprestart.style.display = 'none';
    
    localStorage.clear();
    Load();
}

function abortRestart(){
    popuprestart.style.display = 'none';
}


SfxSwitch.addEventListener('change', () => {
    if (SfxSwitch.checked){
        localStorage.setItem("SFX", false);

        SfxSwitch.ariaChecked = true;
        soundon = false;
    }

    else{
        localStorage.setItem("SFX", true);

        SfxSwitch.ariaChecked = false;
        soundon = true;  
    }
})

AutoSwitch.addEventListener('change', () => {
    if (AutoSwitch.checked){
        localStorage.setItem("Autorun", false);

        AutoSwitch.ariaChecked = true;
        autorun = false;
    }

    else{
        localStorage.setItem("Autorun", true);

        AutoSwitch.ariaChecked = false;
        autorun = true;
    }
})



