const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server
const app = express();

//middleware
app.use(bodyParser.json());

//function test(req,res){
//}(แบบเก่า)
app.get("/", (req, res) => {
  res.send("<h1> welcome, this is a webhook for Line chatbot</h1>");
});
app.post("/webhook", (req, res) => {
  //create webhook client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);

    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://img.kapook.com/u/2024/wanwanat/bmi.jpg",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "BMI Calculation Result",
              weight: "bold",
              size: "xl",
            },
            {
              type: "box",
              layout: "baseline",
              margin: "md",
              contents: [],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ค่าดัชนีมวลกายของคุณ",
                      color: "#000000",
                      flex: 10,
                      size: "lg",
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "น้ำหนักของคุณ(Kg):",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "weight" + " Kg ",
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "ส่วนสูงของคุณ(Cm):",
                  weight: "bold",
                },
                {
                  type: "text",
                  size: "sm",
                  text: "height" + height * 100 + " Cm ",
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "separator",
                  margin: "xxl",
                  color: "#000000",
                },
                {
                  type: "text",
                  text: "BMI:+bmi",
                  gravity: "center",
                  align: "center",
                  size: "xxl",
                  color: "#FF0000",
                },
                {
                  type: "text",
                  text: "result",
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "รายละเอียดเพิ่มเติม",
                uri: "https://health.kapook.com/view86346.html",
              },
              margin: "none",
              color: "#000000",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [],
              margin: "sm",
            },
          ],
          flex: 0,
          backgroundColor: "#FF8C00",
        },
      },
    };
    //   agent.add(result);
    let payload = new Payload(`LINE`, flexMessage, {
      sendAsMessage: true,
    });
    agent.add(result);
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);

  intentMap.set("BMI - custom - yes", bodyMassIndex);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log("Server is runnung at http://localhost:" + port);
});
