---
notion-id: 3c3737bad00c8098abd1cf0f69a521ca
created: 2026-08-21T21:18:00+09:00
---
`MessagesState`는 LangGraph에서 대화 메시지를 저장하기 위해 미리 만들어둔 State 자료구조다. `messages`라는 상태값을 직접 정의하지 않아도 되는 LangGraph가 제공하는 메시지 전용 기본 State다.

## 1. 원래 직접 만들면 (TypedDict)

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain.messages import AnyMessage
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

```
State
└── messages
      ├── HumanMessage
      ├── AIMessage
      ├── ToolMessage
      └── ...
```

- 이렇게 직접 필드를 선언하고, 전용 `add_messages` Reducer를 적용해야 한다.
	- 참고로 `add_messages`는 기존 메시지와 새로운 메시지를 합쳐주는 reducer다.
- 근데 이런 스키마를 너무 자주 사용하니까 미리 만들어둔 것이 `MessagesState`다.
	- LLM Agent는 거의 항상 대화 히스토리가 필요함

## 2. 만들어둔 거 사용하면 (MessagesState)

```python
class MessagesState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
```

- 개념적으로 `MessagesState`는 이런 스키마를 가지고 있는 것

```python
# LangGraph MessagesState라는 미리 만들어진 상태를 사용
from langgraph.graph import MessagesState
from typing import List
from langchain_core.documents import Document

class GraphState(MessagesState):
    # messages 키는 기본 제공 
    # - 다른 키를 추가하고 싶을 경우 아래 같이 적용 가능 
    documents: List[Document]
    grade: float
    num_generation: int
```

- 자동으로 `messages` 키를 만들어준다. (Reducer도 `add_messages` 자동 설정)
	- `MessagesState` → `messages`만 있는 기본 State
	- `MyState(MessagesState)` → 기본 State를 가져와서 내 맘대로 확장 가능
	- 상속하는 대상은 데이터가 아니라 State의 구조(스키마)

```python
graph.invoke({
    "messages": [
        ("user", "안녕")
    ]
})
```

- 실행을 위와 같은 방식으로 하면

```
messages
└── HumanMessage("안녕")
```

- 이렇게 메시지 리스트가 상태에 자동으로 누적 저장된다.
	- `MessagesState`에는 `add_messages` Reducer가 설정되어 있다.
- 메시지가 쌓이거나 LLM의 입력 쿼리로 들어가는 원리는 `MessageGraph`와 동일하다.
	- 다만 `StateGraph`를 기반으로 구현했기 때문에 확장성이 더 좋다.

||MessageGraph|StateGraph + MessagesState|
|---|---|---|
|메시지 저장|O|O|
|추가 상태 필드|❌|✅|

## 참고

[[StateGraph]]

[[MessageGraph]]