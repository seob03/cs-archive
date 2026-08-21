---
notion-id: 3c3737bad00c80d9b937d60e1bcc4b87
created: 2026-08-21T20:18:00+09:00
---
`MessageGraph`는 LangGraph에서 상태를 “메시지 리스트” 하나로만 사용하는 특수한 형태다. `StateGraph`에서 State가 오직 `messages`뿐인 버전이다. 다만 현재 LangGraph에서는 사용 중단 예정 상태다. 실제로는 `StateGraph + MessagesState`를 사용한다.

```python
graph = MessageGraph()

def chatbot(messages):
    response = llm.invoke(messages)
    return response

graph.add_node("chatbot", chatbot)
```

- 예를 들어 이런 코드가 있을 때 `chatbot`은 `messages`를 받는다.

```python
[
    HumanMessage(content="안녕"),
    AIMessage(content="안녕하세요"),
    HumanMessage(content="파이썬 알려줘")
]
```

- 그러면 `chatbot`은 이런 메시지 리스트를 그대로 입력 쿼리로 받게 된다.

```python
[HumanMessage]
      ↓
[AIMessage]
      ↓
[HumanMessage]
      ↓
[AIMessage]  ← 새 메시지
```

- 그리고 그러면 LLM이 출력한 `AIMessage`가 그대로 기존 메시지 뒤에 추가되는 식이다.
- 다만 이 경우에는 메시지 리스트만 상태로 가지고 있기 때문에 확장성이 좋지 않다.
	- 그래서 요즘에는 [[StateGraph]] + [[MessagesState]] 를 사용한다.

## 참고

[[StateGraph]]

[[MessagesState]]