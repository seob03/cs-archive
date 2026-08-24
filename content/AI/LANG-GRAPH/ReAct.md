---
notion-id: 3c6737bad00c80ea8604f5c5b77fc0f1
created: 2026-08-24T16:12:00+09:00
---
ReAct는 Reasoning and Acting을 합친 단어로 가장 일반적인 에이전트의 동장 방식을 말한다. 동작 방식은 모델이 특정 도구를 호출(Act)하면 그 도구 출력을 바탕으로 다음 행동을 결정하는 추론(reaseon)하는 방식이다.

```
사용자: "서울 날씨 보고 우산 필요한지 알려줘"

1. Reasoning
   → 현재 날씨를 알아야겠다.

2. Acting
   → weather_tool 호출

3. Observation
   → "비 올 확률 80%"

4. Reasoning
   → 우산이 필요하겠다.

5. Answer
   → "오늘은 우산을 챙기는 게 좋습니다."
```

핵심은 LLM이 상황에 따라 Tool을 선택하고, Tool 결과를 보고 다음 행동을 다시 결정하는 것이다. 참고로 Observation의 경우에는 도구를 실행한 뒤 나온 결과를 Agent가 다음 판단에 사용하는 정보라고 보면 된다.

## 참고

[[LangGraph 내장 ReAct Agent]]