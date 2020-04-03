let config = {}, hasUp = false;

function handleAPIErr(err)
{
    alert("Error communicating with API.")
}

currentData = {};

function setCounts(data)
{
    if(!data.counts)
    {
        $("#classes-numbers").html("");
        return;
    }

    let countsPairs = [];
    countsPairs.push(["Remaining", data.counts.remaining]);
    for(key in data.counts)
    {
        if(key == "remaining")
            continue;
        
        capitilizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        countsPairs.push([capitilizedKey, data.counts[key]]);
    }
    let countsStr = countsPairs.map((pair) => { return pair.join(": "); }).join(", ");
    $("#classes-numbers").html(countsStr);
}

function setCurrentDataHTML(data)
{
    $("#stacked-cards-block").html('<div class="stackedcards-container"></div><div class="stackedcards--animatable stackedcards-overlay top">TOP</div> <div class="stackedcards--animatable stackedcards-overlay right">RIGHT</div> <div class="stackedcards--animatable stackedcards-overlay left">LEFT</div>');
    initView();

    let card = $(".stackedcards-container").append('<div class="card-item"></div>');
    card.html(`<img src='/data/${data.name}'/>`)
}

function getNextData(cb)
{
    $.get("/next-data", (result)=>
    {
        currentData = result;

        
        // Everything is labeled
        if(!result.name)
        {
            $(".stackedcards.init").css("opacity", "1")
            $(".global-actions").css("opacity", "0");
            $("#stacked-cards-block").html("<span>Done labeling!</span>");
            initView();
            setCounts({});
            return;
        }
        else
            setCounts(currentData);

        setCurrentDataHTML(currentData);
        stackedCards();
    }).fail(handleAPIErr);
}

function decided(decision)
{
    $.post("/set-label", { name: currentData.name, label: config.labels[decision] }).done(() => 
    {
        getNextData();
    }).fail(handleAPIErr);
}

function decisionUp()
{
    decided("up");
}
function decisionRight()
{
    decided("right");
}
function decisionLeft()
{
    decided("left");
}

function initView()
{
    let labels = config.labels;
    if(!labels.up)
        $(".top-action").remove();
    else
    {
        $(".top-action").html(labels.up);
        $(".stackedcards--animatable.stackedcards-overlay.top").html(labels.up);
        hasUp = true;
    }

    $(".left-action").html(labels.left);
    $(".stackedcards--animatable.stackedcards-overlay.left").html(labels.left);


    $(".right-action").html(labels.right);
    $(".stackedcards--animatable.stackedcards-overlay.right").html(labels.right);
}

$.get("/config", (result)=>
{
    config.labels = result;
    getNextData(initView);
}).fail(handleAPIErr);