
//////////////////
// sokuji.html
//////////////////
$('.chb').on( "click",function(){
  //total calculation
  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    var OneRaceValA = 0;
    var OneRaceValB = 0;
    var round = 0;
    var TotalValA = 0;
    var TotalValB = 0;
    var TotalRaceNum = $("#total_race_num").val();

    // Score for one race
    $(this).prevAll().each(function () {
      OneRaceValA += parseInt($(this).children('.chb:checked').val()) || 0;
      round = parseInt($(this).attr('round'));
    });
    OneRaceValB = 82 - OneRaceValA;

    // Cumulative score
    var temp = "";
    $("#resultarray").find('.oneracepoints:gt(0):lt('+(round-1)+')').each(function (index, elem) {
      temp = $(this).text().split('/')[0].split('-');
      TotalValA += parseInt(temp[0]);
      TotalValB += parseInt(temp[1]);
    });

    TotalValA += OneRaceValA;
    TotalValB += OneRaceValB;

    // cumlative score, diff of score, rem race
    var CumlRaceResult = $("#teamA").val() + " " +  TotalValA + "-" + TotalValB + " " + $("#teamB").val();
    var diff = TotalValA - TotalValB;
    var RemRace = "/残り" + (TotalRaceNum - round) + "レース";
    var Reverse = ((TotalRaceNum - round)*40 < diff) ? " （勝利確定！）" : "";

    // Print
    if (OneRaceValA>0 && TotalValA){
      return OneRaceValA + "-" + OneRaceValB + "/ 合計: " + CumlRaceResult + "/点数差:" + diff + RemRace + Reverse;
    } else {
      return ""
    }
  });
  $(".printer-type tr:last td:last").text("")
});


// select cource
$('.toggle').click(function () {
	var classes = ['imclass1','imclass2','imclass3'];
	$(this).each(function(){
		this.className = classes[($.inArray(this.className, classes)+1)%classes.length];
	});
});

//////////////////
// sokuji_tri.html
//////////////////
$('.teamnames_tri').hover(function(){
  //set team name

  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      $(this).find('input').each(function(){
        temp_team = $(this).val();
        if($("#teamA").val().length>0 & temp_team=="A"){
          $(this).attr("teamname", $("#teamA").val());
        } else if ($("#teamB").val().length>0 & temp_team=="B"){
          $(this).attr("teamname", $("#teamB").val());
        } else if ($("#teamC").val().length>0 & temp_team=="C"){
          $(this).attr("teamname", $("#teamC").val());
        } else if ($("#teamD").val().length>0 & temp_team=="D"){
          $(this).attr("teamname", $("#teamD").val());
        } else{
          $(this).attr("teamname", temp_team);
        };
      });
    });
  });
});

$('.chb_tri').on( "click",function(){
  //total calculation
  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    var OneRaceValA = 0;
    var OneRaceValB = 0;
    var OneRaceValC = 0;
    var OneRaceValD = 0;

    var TotalValA = 0;
    var TotalValB = 0;
    var TotalValC = 0;
    var TotalValD = 0;
    var round = 0;

    var ThisRaceResult = "";
    var CumlRaceResult = "";
    var RemRace = 0;
    var CurrentRank = 0;
    var TotalRaceNum = $("#total_race_num").val();


    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      temp = $(this).children(':checked').attr('name');
      if (temp){
        temp_team = $(this).children(':checked').val();
        temp_val = parseInt(temp.split("-")[1]);

        if (temp_team=="A"){
          OneRaceValA += temp_val;
        } else if (temp_team=="B"){
          OneRaceValB += temp_val;
        } else if (temp_team=="C"){
          OneRaceValC += temp_val;
        } else {
          OneRaceValD += temp_val;
        }
      }

      round = parseInt($(this).attr('round'));
    });

    ThisRaceResult = OneRaceValA + "-" + OneRaceValB + "-" + OneRaceValC + "-" + OneRaceValD;

    // Cumulative score
    var temp = "";
    $("#resultarray").find('.oneracepoints:gt(0):lt('+(round-1)+')').each(function () {
      temp = $(this).text().split('//')[0].split('-');
      TotalValA += parseInt(temp[0]);
      TotalValB += parseInt(temp[1]);
      TotalValC += parseInt(temp[2]);
      TotalValD += parseInt(temp[3]);
    });

    TotalValA += OneRaceValA;
    TotalValB += OneRaceValB;
    TotalValC += OneRaceValC;
    TotalValD += OneRaceValD;

    if (OneRaceValA===82 || !TotalValA){
      return "";
    }

    CumlRaceResult = $("#teamA").val() + " " + TotalValA + " vs "+ $("#teamB").val() + " "
     + TotalValB + " vs " + $("#teamC").val() + " " + TotalValC+ " vs " + $("#teamD").val() + " " + TotalValD;

    // Remined Race
    RemRace = " 残り" + (TotalRaceNum - round) + "レース";

    // Messages
    /// sort scores for fix rank
    var Scores = [
       {ind:0,name:$("#teamA").val(),tscore:TotalValA,diff:TotalValA-TotalValA},
       {ind:1,name:$("#teamB").val(),tscore:TotalValB,diff:TotalValA-TotalValB},
       {ind:2,name:$("#teamC").val(),tscore:TotalValC,diff:TotalValA-TotalValC},
       {ind:3,name:$("#teamD").val(),tscore:TotalValD,diff:TotalValA-TotalValD},
    ]
    Scores.sort(function(a,b){
        if(a.tscore > b.tscore) return -1;
        if(a.tscore < b.tscore) return 1;
        return 0;
    });

    /// fix diff and current A's rank
    var temprank = 0;
    var diffmessages = "";

    for (var v of Scores) {
      temprank += 1;
      if (v['ind']==0){
        CurrentRank = temprank;
      } else {
        if (v['name'].length>0){
          diffmessages += (temprank + "位'" + v['name'] + "'と" + (v['diff']) + "点差,");
        } else {
          diffmessages += (temprank + "位" + v['name'] + "と" + (v['diff']) + "点差,");
        }
      }
    }


    if (OneRaceValA>0 || OneRaceValB>0){
      return ThisRaceResult + " // 合計:" + CumlRaceResult + " / 現在" + CurrentRank + "位 / " + diffmessages + " / " + RemRace;
    } else {
      return ""
    }

  });
  $(".printer-type tr:last td:last").text("")
});

//////////////////
// sokuji_four.html
//////////////////
$('.teamnames_four').hover(function(){
  //set team name

  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      $(this).find('input').each(function(){
        temp_team = $(this).val();
        if($("#teamA").val().length>0 & temp_team=="A"){
          $(this).attr("teamname", $("#teamA").val());
        } else if ($("#teamB").val().length>0 & temp_team=="B"){
          $(this).attr("teamname", $("#teamB").val());
        } else if ($("#teamC").val().length>0 & temp_team=="C"){
          $(this).attr("teamname", $("#teamC").val());
        } else{
          $(this).attr("teamname", temp_team);
        };
      });
    });
  });
});

$('.chb_four').on( "click",function(){
  //total calculation
  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    var OneRaceValA = 0;
    var OneRaceValB = 0;
    var OneRaceValC = 0;

    var TotalValA = 0;
    var TotalValB = 0;
    var TotalValC = 0;
    var round = 0;

    var ThisRaceResult = "";
    var CumlRaceResult = "";
    var RemRace = 0;
    var CurrentRank = 0;
    var TotalRaceNum = $("#total_race_num").val();


    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      temp = $(this).children(':checked').attr('name');
      if (temp){
        temp_team = $(this).children(':checked').val();
        temp_val = parseInt(temp.split("-")[1]);

        if (temp_team=="A"){
          OneRaceValA += temp_val;
        } else if (temp_team=="B"){
          OneRaceValB += temp_val;
        } else if (temp_team=="C"){
          OneRaceValC += temp_val;
        }
      }

      round = parseInt($(this).attr('round'));
    });

    ThisRaceResult = OneRaceValA + "-" + OneRaceValB + "-" + OneRaceValC;

    // Cumulative score
    var temp = "";
    $("#resultarray").find('.oneracepoints:gt(0):lt('+(round-1)+')').each(function () {
      temp = $(this).text().split('//')[0].split('-');
      TotalValA += parseInt(temp[0]);
      TotalValB += parseInt(temp[1]);
      TotalValC += parseInt(temp[2]);
    });

    TotalValA += OneRaceValA;
    TotalValB += OneRaceValB;
    TotalValC += OneRaceValC;

    if (OneRaceValA===82 || !TotalValA){
      return "";
    }

    CumlRaceResult = $("#teamA").val() + " " + TotalValA + " vs "+ $("#teamB").val() + " "
     + TotalValB + " vs " + $("#teamC").val() + " " + TotalValC;

    // Remined Race
    RemRace = " 残り" + (TotalRaceNum - round) + "レース";

    // Messages
    /// sort scores for fix rank
    var Scores = [
       {ind:0,name:$("#teamA").val(),tscore:TotalValA,diff:TotalValA-TotalValA},
       {ind:1,name:$("#teamB").val(),tscore:TotalValB,diff:TotalValA-TotalValB},
       {ind:2,name:$("#teamC").val(),tscore:TotalValC,diff:TotalValA-TotalValC},
    ]
    Scores.sort(function(a,b){
        if(a.tscore > b.tscore) return -1;
        if(a.tscore < b.tscore) return 1;
        return 0;
    });

    /// fix diff and current A's rank
    var temprank = 0;
    var diffmessages = "";

    for (var v of Scores) {
      temprank += 1;
      if (v['ind']==0){
        CurrentRank = temprank;
      } else {
        if (v['name'].length>0){
          diffmessages += (temprank + "位'" + v['name'] + "'と" + (v['diff']) + "点差,");
        } else {
          diffmessages += (temprank + "位" + v['name'] + "と" + (v['diff']) + "点差,");
        }
      }
    }


    if (OneRaceValA>0 || OneRaceValB>0){
      return ThisRaceResult + " // 合計:" + CumlRaceResult + " / 現在" + CurrentRank + "位 / " + diffmessages + " / " + RemRace;
    } else {
      return ""
    }

  });
  $(".printer-type tr:last td:last").text("")
});

$('.toggle').click(function () {
	var classes = ['imclass1','imclass2','imclass3'];
	$(this).each(function(){
		this.className = classes[($.inArray(this.className, classes)+1)%classes.length];
	});
});


//////////////////
// sokuji_tag.html
//////////////////
$('.teamnames_tag').hover(function(){
  //set team name
  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      $(this).find('input').each(function(){
        temp_team = $(this).val();
        if($("#teamA").val().length>0 & temp_team=="A"){
          $(this).attr("teamname", $("#teamA").val());
        } else if ($("#teamB").val().length>0 & temp_team=="B"){
          $(this).attr("teamname", $("#teamB").val());
        } else if ($("#teamC").val().length>0 & temp_team=="C"){
          $(this).attr("teamname", $("#teamC").val());
        } else if ($("#teamD").val().length>0 & temp_team=="D"){
          $(this).attr("teamname", $("#teamD").val());
        } else if ($("#teamE").val().length>0 & temp_team=="E"){
          $(this).attr("teamname", $("#teamE").val());
        } else if ($("#teamF").val().length>0 & temp_team=="F"){
          $(this).attr("teamname", $("#teamF").val());
        } else{
          $(this).attr("teamname", temp_team);
        };
      });
    });
  });
});

$('.chb_tag').on( "click",function(){
  //total calculation
  $(".printer-type tr:not(:first, last) td:last-child").text(function () {
    var OneRaceValA = 0;
    var OneRaceValB = 0;
    var OneRaceValC = 0;
    var OneRaceValD = 0;
    var OneRaceValE = 0;
    var OneRaceValF = 0;

    var TotalValA = 0;
    var TotalValB = 0;
    var TotalValC = 0;
    var TotalValD = 0;
    var TotalValE = 0;
    var TotalValF = 0;
    var round = 0;

    var ThisRaceResult = "";
    var CumlRaceResult = "";
    var RemRace = 0;
    var CurrentRank = 0;
    var TotalRaceNum = $("#total_race_num").val();


    // Score for one race, TeamA
    $(this).prevAll().each(function () {
      temp = $(this).children(':checked').attr('name');
      if (temp){
        temp_team = $(this).children(':checked').val();
        temp_val = parseInt(temp.split("-")[1]);

        if (temp_team=="A"){
          OneRaceValA += temp_val;
        } else if (temp_team=="B"){
          OneRaceValB += temp_val;
        } else if (temp_team=="C"){
          OneRaceValC += temp_val;
        } else if (temp_team=="D"){
          OneRaceValD += temp_val;
        } else if (temp_team=="E"){
          OneRaceValE += temp_val;
        } else if (temp_team=="F"){
          OneRaceValF += temp_val;
        }
      }

      round = parseInt($(this).attr('round'));
    });

    ThisRaceResult = OneRaceValA + "-" + OneRaceValB + "-" + OneRaceValC + "-" + OneRaceValD + "-" + OneRaceValE + "-" + OneRaceValF;

    // Cumulative score
    var temp = "";
    $("#resultarray").find('.oneracepoints:gt(0):lt('+(round-1)+')').each(function () {
      temp = $(this).text().split('//')[0].split('-');
      TotalValA += parseInt(temp[0]);
      TotalValB += parseInt(temp[1]);
      TotalValC += parseInt(temp[2]);
      TotalValD += parseInt(temp[3]);
      TotalValE += parseInt(temp[4]);
      TotalValF += parseInt(temp[5]);
    });

    TotalValA += OneRaceValA;
    TotalValB += OneRaceValB;
    TotalValC += OneRaceValC;
    TotalValD += OneRaceValD;
    TotalValE += OneRaceValE;
    TotalValF += OneRaceValF;

    if (OneRaceValA===82 || !TotalValA){
      return "";
    }

    CumlRaceResult = $("#teamA").val() + " " + TotalValA + " vs "+ $("#teamB").val() + " "
     + TotalValB + " vs " + $("#teamC").val() + " " + TotalValC + " vs " + $("#teamD").val() + " " + TotalValD
      + " vs " + $("#teamE").val() + " " + TotalValE + " vs " + $("#teamF").val() + " " + TotalValF;

    // Remined Race
    RemRace = " 残り" + (TotalRaceNum - round) + "レース";

    // Messages
    /// sort scores for fix rank
    var Scores = [
       {ind:0,name:$("#teamA").val(),tscore:TotalValA,diff:TotalValA-TotalValA},
       {ind:1,name:$("#teamB").val(),tscore:TotalValB,diff:TotalValA-TotalValB},
       {ind:2,name:$("#teamC").val(),tscore:TotalValC,diff:TotalValA-TotalValC},
       {ind:2,name:$("#teamD").val(),tscore:TotalValD,diff:TotalValA-TotalValD},
       {ind:2,name:$("#teamE").val(),tscore:TotalValE,diff:TotalValA-TotalValE},
       {ind:2,name:$("#teamF").val(),tscore:TotalValF,diff:TotalValA-TotalValF},
    ]
    Scores.sort(function(a,b){
        if(a.tscore > b.tscore) return -1;
        if(a.tscore < b.tscore) return 1;
        return 0;
    });

    /// fix diff and current A's rank
    var temprank = 0;
    var diffmessages = "";

    for (var v of Scores) {
      temprank += 1;
      if (v['ind']==0){
        CurrentRank = temprank;
      } else {
        if (v['name'].length>0){
          diffmessages += (temprank + "位'" + v['name'] + "'と" + (v['diff']) + "点差,");
        } else {
          diffmessages += (temprank + "位" + v['name'] + "と" + (v['diff']) + "点差,");
        }
      }
    }


    if (OneRaceValA>0 || OneRaceValB>0){
      return ThisRaceResult + " // 合計:" + CumlRaceResult + " / 現在" + CurrentRank + "位 / " + diffmessages + " / " + RemRace;
    } else {
      return ""
    }

  });
  $(".printer-type tr:last td:last").text("")
});
