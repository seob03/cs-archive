---
notion-id: 3c6737bad00c80bbbccdfff4b8ae052b
created: 2026-08-24T22:20:00+09:00
---
`MemorySaver`는 그래프에서 각 단계 그래프 상태를 자동으로 저장해주는 체크포인터다. 그래프 실행이 끝난 뒤에도 그래프의 상태를 기억하기 때문에 재실행 하더라도 이전 상태를 기억하게 된다.

```python
from langgraph.checkpoint.memory import MemorySaver

# 메모리 초기화 
memory = MemorySaver()

# 체크포인터 지정하여 그래프 컴파일 (StateGraph 기준)
graph_memory = builder.compile(checkpointer=memory)

# 체크포인터 지정하여 그래프 생성 (내장 ReAct Agent 그래프 기준)
graph = create_react_agent(
    llm, 
    tools=tools, 
    state_modifier=system_prompt,
    checkpointer=memory,
)
```

- `StateGraph` 기준으로 컴파일할 때 체크포인터를 지정하면 된다.
- LangGraph 내장 ReAct Agent를 사용하는 경우에는 필드에 지정하면 된다.

```python
config = {"configurable": {"thread_id": "1"}}
messages = [HumanMessage(content="스테이크 메뉴의 가격은 얼마인가요?")]
messages = graph_memory.invoke({"messages": messages}, config)
for m in messages['messages']:
    m.pretty_print()
```

- 메모리를 사용할 때는 `thread_id`를 지정해야 한다.
- 대화마다 기억해야할 내용이 다르기 때문에 구분하기 위함이다.

```python
config = {"configurable": {"thread_id": "1"}}
messages = [HumanMessage(content="둘 중에 더 저렴한 메뉴는 무엇인가요?")]
messages = graph_memory.invoke({"messages": messages}, config)
for m in messages['messages']:
    m.pretty_print()
```

- 이어지는 대화에서 같은 `thread_id`를 지정하면 이전 대화의 State를 불러와 이어서 사용할 수 있다.
	- [[MessagesState 1]]를 사용하는 경우, State의 `"messages"`에 누적된 `HumanMessage`, `AIMessage`, `ToolMessage` 등의 대화 흐름도 함께 복원된다.

주의: `MemorySaver`는 `messages` 전용이 아니라 그래프의 전체 State를 저장하는 Checkpointer이다. `MessagesState`를 사용하면 `messages`도 State에 포함되므로 대화 흐름까지 기억하게 되는 것이다.

```
checkpointer=memory
→ 그래프에 "기억 기능"을 붙임

config.thread_id
→ "어느 대화의 기억을 사용할지" 지정
```

다만 `.invoke()`에서 `thread_id`를 지정하는 것은 그래프 자체에 기억 기능을 추가하는 것이 아니다. 이미 연결된 `checkpointer`에서 해당 `thread_id`의 기존 State를 불러와 이어서 실행하고, 실행 후 변경된 State를 다시 같은 `thread_id`에 저장하는 역할이다.