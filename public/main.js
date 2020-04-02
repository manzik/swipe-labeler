let config = {}, hasUp = false;

function handleAPIErr(err)
{
    alert("Error communicating with API.")
}

currentData = {};

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
        // Everything is labeled
        if(!result.name)
        {
            $(".stackedcards.init").css("opacity", "1")
            $("#stacked-cards-block").html("<span>Done labeling!</span>");
            initView();
            return;
        }

        currentData = result;
        setCurrentDataHTML(result);
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