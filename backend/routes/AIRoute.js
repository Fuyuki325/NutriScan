const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

const dotenv = require('dotenv');

// Use body-parser to handle raw binary data
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '5mb' }));



dotenv.config(); // load .env

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/', async (req, res) => {
  try {
    // console.log('Received request headers:', req.headers);
    // console.log('Received body length:', req.body.length);

    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    console.log('req.body', req.body);
    
    // Convert the raw binary data to base64
    const base64Image = req.body.image.toString('base64');

    console.log('Image encoded to base64', base64Image);

    const base64Image_new = base64Image.replace(/^data:image\/jpeg;base64,/,'')
    // Prepare the message for Claude
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image_new,
            },
          },
          {
            type: 'text',
            text: 'options: \ (A)Vegan  \ (B) Vegetarian \ (C) Halal \ (D) Gluten-Free \ (E) Dairy-Free \(F) Nut-Free(no including nut) ',
          },
        ],
      },
    ];

    console.log('Sending request to Claude API');

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: messages,
      system: "You are an expert assistant on food category. Here is the food image, you should choose the type, it may be mutiple answers, return the format as json, and only return the options, don't need more description words."
    });

    console.log('Received response from Claude API');
    
    //mapping
    const mappingOptions = {
      "Vegan": "A",
      "Vegetarian": "B",
      "Halal": "C",
      "Gluten-Free": "D",
      "Dairy-Free": "E",
      "Nut-Free" : "F"
    };

    const data = response.content[0].text
    console.log('data-fact', data)
    const fuyu = response.content;
    console.log('fuyu', fuyu)
    try {
      // Parse the nested JSON string in the 'description' field
      const nestedData = JSON.parse(data);
      console.log('nest-data', nestedData)
      // Check if options field exists and contains the expected characters (A to E)
      if (nestedData.options && Array.isArray(nestedData.options)) {
          // const expectedOptions = ['A', 'B', 'C', 'D', 'E'];


          const mappedOptions = nestedData.options.map(option => mappingOptions[option] || option);

        // console.log('mappedOptions', mappedOptions)
        // 确保所有选项都是单个字符
        const isValidOptions = mappedOptions.every(option => option.length === 1);



        if(isValidOptions){
          res.json({ options: mappedOptions });
        }
        else{
          res.status(400).json({ error: 'Invalid data format or missing options' });
        }
          
      } else {
          res.status(400).json({ error: 'Invalid data format or missing options' });
      }
  } catch (error) {
      res.status(400).json({ error: 'Failed to parse description JSON string' });
  }

    // Send Claude's response
    // res.json({ description: response.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

module.exports = app;