# Testing the OMR Scanning Functionality

## Step-by-Step Testing Guide

### 1. Create a Quiz with Answer Key

1. **Login as Professor**
   - Open `html/login.html` directly in your browser or access it through a local server (if using one)
   - Login with a professor account (or register a new one)

2. **Create a New Quiz**
   - Navigate to "Quizzes" page
   - Click "CREATE NEW QUIZ"
   - Fill in:
     - Quiz Name: e.g., "Test 1 - ASD"
     - Number of Questions: e.g., 5 (start small for testing)
     - Number of Answer Options: 4 (A, B, C, D)
   - **IMPORTANT**: Select the correct answers for each question
   - Click "SAVE QUIZ"

### 2. Prepare a Test Answer Sheet

You have a few options:

#### Option A: Create a Simple Test Image
1. Draw or create an answer sheet with:
   - 5 questions (or however many you set)
   - 4 answer options per question (A, B, C, D)
   - Fill in some bubbles/rectangles to simulate student answers
   - Take a photo or scan it

#### Option B: Use a Digital Mock-up
1. Create a simple image (PNG/JPG) with:
   - A grid of rectangles or circles
   - Some filled in (black/dark) to represent answers
   - Save it as an image file

#### Option C: Use Any Image for Testing
- You can use any image to test the detection algorithm
- The system will try to detect dark regions

### 3. Test the Scanning

1. **Go to Scan Page**
   - From the Quizzes page, click "📷 Scan" button on a quiz
   - Or navigate directly to `html/scan_quiz.html`

2. **Select the Quiz**
   - In the dropdown, select the quiz you just created
   - You should see quiz info appear

3. **Upload the Answer Sheet Image**
   - Click the scan area or "Tap to Scan / Upload Paper"
   - Select your test image file
   - The image should appear as a preview

4. **Wait for Processing**
   - The system will process the image
   - It detects filled bubbles/rectangles
   - Compares with the answer key

5. **View Results**
   - You'll see:
     - Score (e.g., "3/5")
     - Percentage
     - Detailed breakdown showing which questions were correct/incorrect

6. **Save the Result**
   - Enter student name (optional)
   - Enter student ID (optional)
   - Click "Save Result"
   - The result will be saved to the student's test history

### 4. Verify the Results

1. **Check Student Portal**
   - Login as a student (or the student whose result you saved)
   - Go to Student Dashboard
   - Click on the subject (e.g., "ASD")
   - You should see the test result appear in the list

### Tips for Better Detection

- **Image Quality**: Use clear, well-lit images
- **Contrast**: High contrast between filled and empty bubbles works best
- **Alignment**: The system assumes a grid layout, so keep bubbles aligned
- **Start Small**: Test with 3-5 questions first to verify it works
- **Adjust Threshold**: If detection isn't working, the darkness threshold (100) in the code may need adjustment

### Troubleshooting

- **"No answer key" error**: Make sure you selected answers when creating the quiz
- **Poor detection**: Try a clearer image or adjust the threshold in `detectBubbles()` function
- **Wrong answers detected**: The grid detection is simplified - may need calibration for your specific answer sheet format

