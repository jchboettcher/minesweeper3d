import pyautogui
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0

while True:
  pyautogui.click(202,181)
  for _ in range(3):
    pyautogui.click(144,214)
    pyautogui.click(129,248)
    pyautogui.click(101,249)
    pyautogui.click(87,223)
    pyautogui.click(115,223)
    pyautogui.click(142,179)
  pyautogui.moveTo(142,179,0.5)