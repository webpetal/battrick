// ==UserScript==
// @name         Battrick Squad
// @namespace    https://github.com/webpetal/battrick
// @version      0.3
// @description  Improve squad page for battrick!
// @author       Webpetal
// @match        https://www.battrick.org/nl/squad.asp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=battrick.org
// @updateURL    https://github.com/webpetal/battrick/blob/master/Battrick%20Squad.user.js
// @downloadURL  https://github.com/webpetal/battrick/blob/master/Battrick%20Squad.user.js
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';
//Change this value
    //for batting
    var min_batting_score = 10;
    var bat_sec_weightage = 50; //in percentage. Importance of concentration in batting
    var bat_stamina_weightage = 20; //in percentage. Importance of stamina in batting
    var bat_exp_weightage = 10; //in percentage. Importance of stamina in batting

    //for bowler
    var min_bowling_score = 10;
    var bowl_sec_weightage = 50; //in percentage. Importance of concentration in bowling
    var bowl_stamina_weightage = 20; //in percentage. Importance of stamina in bowling
    var bowl_exp_weightage = 10; //in percentage. Importance of experience in bowling

     //for captain
    var min_captain_score = 10;
    var cap_exp_weightage = 50; //in percentage. Importance of experience in captain
    var cap_stamina_weightage = 20; //in percentage. Importance of stamina in captain

     //for wicketkeeper
     var min_wk_score = 10;
     var wk_sec_weightage = 50; //in percentage. Importance of fielding in wicketkeeper
     var wk_stamina_weightage = 20; //in percentage. Importance of stamina in wicketkeeper
     var wk_batting_weightage = 40; //in percentage. Importance of batting in wicketkeeper
     



//getting ready according to new sorting
    var overallBox = $('.box');
    var overallBoxHeading = $('.subheadernew');

    overallBox.css({
        'display':'flex',
        'flex-wrap': 'wrap'
    });
    overallBoxHeading.css({
        'width':'100%'
    });
// inserting new buttons
    overallBox.prepend('<div class="wp-newbuttons"><a class="sortbybatsman">Batman</a><a class="sortbybowler">Bowler</a> <a class="sortbyleadership">Captain</a> <a class="sortbywk">WicketKeeper</a></div>');

// getting all players

    var players = new Array();
    var elements = $('.player');
    elements.each(function() {

        //vars
        var playerid = $(this).attr('id');
        var playerwage = $(this).find('.player_wage').html();
        var playerstamina = $(this).find('.player_stamina > a').data('level');
        var playerleadership = $(this).find('.player_leadership > a').data('level');
        var playerexp = $(this).find('.player_experience > a').data('level');
        var playerbatting = $(this).find('.player_batting > a').data('level');
        var playerconcentration = $(this).find('.player_concentration > a').data('level');
        var playerbowling = $(this).find('.player_bowling > a').data('level');
        var playerconsistency = $(this).find('.player_consistency > a').data('level');
        var playerkeeper = $(this).find('.player_keeping > a').data('level');
        var playerfielding = $(this).find('.player_fielding > a').data('level');

        //cleaning
        //playerid = playerid.split('_')[1];  not using it to match perfectly
        playerwage = playerwage.substring(1, playerwage.length);

        //calculations
        var batman = playerbatting + ((bat_sec_weightage/100)*playerconcentration) + ((bat_stamina_weightage/100)*playerstamina) + ((bat_exp_weightage/100)*playerexp);
        var bowler = playerbowling + ((bowl_sec_weightage/100)*playerconsistency) + ((bowl_stamina_weightage/100)*playerstamina) + ((bowl_exp_weightage/100)*playerexp);
        var captain = playerleadership + ((cap_exp_weightage/100)*playerexp) + ((cap_stamina_weightage/100)*playerstamina);
        var wk = playerkeeper + ((wk_sec_weightage/100)*playerfielding) + ((wk_stamina_weightage/100)*playerstamina) + ((wk_batting_weightage/100)*playerbatting);


        const player = {
            player_id : playerid,
            player_name : $(this).find('.player_name > a').html(),
            player_age : $(this).find('.player_age').html(),
            player_btr : $(this).find('.player_btr').html(),
            player_wage : playerwage,
            player_stamina : playerstamina,
            player_experience : playerexp,
            player_aggression : $(this).find('.player_aggression > a').data('level'),
            player_batting : playerbatting,
            player_concentration : playerconcentration,
            player_bowling : playerbowling,
            player_consistency : playerconsistency,
            player_keeping : playerkeeping,
            player_fielding :playerfielding,

            //calculated value
            player_batman : batman,
            player_bowler : bowler,
            player_captain : captain,
            player_wk : wk,

        }

        //adding points to player
        var batmanclass = '';
        var bowlerclass = '';
        var captainclass = '';
        var wkclass = '';
        if(batman > min_batting_score) { batmanclass = 'green'; }
        if(bowler > min_bowling_score) { bowlerclass = 'green'; }
        if(captain > min_captain_score) { captainclass = 'green'; }
        if(wk > min_wk_score) { wkclass = 'green'; }

        if($(this).find('#tip5').length>0) {
            $(this).append('<div id="tip6" class="skills"></div>');
            $(this).find('#tip6').append('<span class="skillname '+ batmanclass+'">Batting Score:</span><span class="player_batting_score '+ batmanclass+'">'+ batman.toFixed(2) +'</span>');
            $(this).find('#tip6').append('<span class="skillname '+ bowlerclass+'">Bowling Score:</span><span class="player_bowling_score '+ bowlerclass+'">'+ bowler.toFixed(2) +'</span>');
            $(this).find('#tip6').append('<span class="skillname '+ captainclass+'">Leadership Score:</span><span class="player_bowling_score '+ captainclass+'">'+ captain.toFixed(2) +'</span>');
            $(this).find('#tip6').append('<span class="skillname '+ wkclass+'">Wicketkeeper Score:</span><span class="player_wp_score '+ wkclass+'">'+ wk.toFixed(2) +'</span>');
        }

        players.push(player);
    });

//sorting funstion
    function SortByName(a, b){
        var aName = a.player_name.toLowerCase();
        var bName = b.player_name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
    function SortBybatman(a, b){
        var a_skill = a.player_batman;
        var b_skill = b.player_batman;
        return ((a_skill < b_skill) ? 1 : ((a_skill > b_skill) ? -1 : 0));
    }
    function sortbybowler(a, b){
        var a_skill = a.player_bowler;
        var b_skill = b.player_bowler;
        return ((a_skill < b_skill) ? 1 : ((a_skill > b_skill) ? -1 : 0));
    }
    function sortbyleadership(a, b){
        var a_skill = a.player_captain;
        var b_skill = b.player_captain;
        return ((a_skill < b_skill) ? 1 : ((a_skill > b_skill) ? -1 : 0));
    }
    function sortbywk(a, b){
        var a_skill = a.player_wk;
        var b_skill = b.player_wk;
        return ((a_skill < b_skill) ? 1 : ((a_skill > b_skill) ? -1 : 0));
    }


//click function
    $( "body" ).on( "click", 'a.sortbybatsman', function() {
        players.sort(SortBybatman);
        players.forEach( function(item, index) {
            var playerid = item['player_id'];
            $('#'+playerid).css('order', index);
        });
     });
     $( "body" ).on( "click", 'a.sortbybowler', function() {
        players.sort(sortbybowler);
        players.forEach( function(item, index) {
            var playerid = item['player_id'];
            $('#'+playerid).css('order', index);
        });
     });
    $( "body" ).on( "click", 'a.sortbyleadership', function() {
        players.sort(sortbyleadership);
        players.forEach( function(item, index) {
            var playerid = item['player_id'];
            $('#'+playerid).css('order', index);
        });
     });
     $( "body" ).on( "click", 'a.sortbywk', function() {
        players.sort(sortbywk);
        players.forEach( function(item, index) {
            var playerid = item['player_id'];
            $('#'+playerid).css('order', index);
        });
     });

//test

    players.sort(SortBybatman);
    console.log(players);

//adding style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}
    addGlobalStyle('.wp-newbuttons a { margin:0 10px; }');
    addGlobalStyle('.green { color:green }');
    addGlobalStyle('.skills {display: grid;grid-template-columns: [skill-name] 115px [skill-level] 115px [skill-name] 115px [skill-level] 115px;max-width: 500px;}');
    addGlobalStyle('#tip6 { margin-top: 5px;}')

})();