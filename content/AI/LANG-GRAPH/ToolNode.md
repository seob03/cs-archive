---
notion-id: 3c5737bad00c8032ad13fee844b1e3f3
created: 2026-08-23T15:18:00+09:00
---
`ToolNode`는 LangGraph의 Node다. 다만 일반적인 Node와 다르게 LLM이 요청한 Tool Call을 실행하는 역할이 미리 구현된 특수한 노드다. `AIMessages`에 담긴 도구 호출 요청 목록에 대해 병렬적으로 도구를 호출해주는 역할을 수행한다.

## 1. 일반 Node

```python
def retrieve(state):
    question = state["messages"][-1].content

    docs = retriever.invoke(question)

    return {
        "documents": docs
    }

graph.add_node("retrieve", retrieve)
```

- 일반 노드는 내가 원하는 로직을 직접 함수로 만들어야 했다.
	- State를 받고, 로직을 수행하고, State를 업데이트하고

## 2. ToolNode

```python
from langgraph.prebuilt import ToolNode

tools = [web_search, calculator]

tool_node = ToolNode(tools)

graph.add_node("tools", tool_node)
```

- 다만 `ToolNode`는 내부적으로 아래와 같은 일을 대신 해 준다.

```
사용자
"서울 날씨 알려줘"
    ↓
LLM Node
AIMessage(
  tool_calls = [weather_tool(...)]
)
    ↓
ToolNode
weather_tool 실제 실행
    ↓
ToolMessage
"서울 날씨는 맑습니다."
```

- LLM Node: 어떤 Tool을 쓸지 결정
- Tool Node: 그 Tool을 실제로 실행

[[Tool Calling 1]]의 AIMessage → ToolMessage 쪽을 보면 LLM이 어떤 Tool을 사용해야 겠다고 판단을 하지만, 실제로는 하드 코딩 방식으로 `web_search.invoke(쿼리)`와 같이 도구를 직접 실행했다. 이러한 과정을 `ToolNode`를 통해 `AIMessage`의 `tool_calls`를 통한 도구 요청을 실제 `ToolMessage`로 만들어주는 노드가 `ToolNode`인 거다.

## 3. 실제 사용 예시

```python
from langgraph.prebuilt import ToolNode

# 도구 노드 정의 (tools에는 사용 가능한 도구 리스트)
tools = [search_menu, search_web]
tool_node = ToolNode(tools)

# 도구 호출 
tool_call = llm_with_tools.invoke([HumanMessage(content=f"스테이크 메뉴의 가격은 얼마인가요?")])

tool_call
# AIMessage(content='', additional_kwargs={'tool_calls': [{'index': 0, 'id': 'call_fGsaNQloYgB0c6MY34MC4pIx', 'function': {'arguments': '{"query":"스테이크"}', 'name': 'search_menu'}, 'type': 'function'}]}, response_metadata={'finish_reason': 'tool_calls', 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_f85bea6784'}, id='run-99c022c7-a1f1-4079-9e72-f5b46ee15a04-0', tool_calls=[{'name': 'search_menu', 'args': {'query': '스테이크'}, 'id': 'call_fGsaNQloYgB0c6MY34MC4pIx', 'type': 'tool_call'}])
```

- `ToolNode(tools)`를 통해 도구 노드를 정의했다.
	- `tools`는 `ToolNode`가 실제로 실행할 수 있는 도구 목록이다.
	- 그래서 보통 같은 `tools`를 LLM에도 바인딩함.
- `AIMessage`를 통해 필요한 도구 리스트 `tool_calls`를 받았다.
	- 이 `AIMessage`를 `tool_call`이라는 변수에 담아둔 것이다.

```python
# 도구 호출 결과를 메시지로 추가하여 실행 
results = tool_node.invoke({"messages": [tool_call]})

# 실행 결과 출력하여 확인 
for result in results['messages']:
    print(result.content)
    print() 
    # 도구 사용을 통해 스테이크 메뉴와 가격이 2개가 잘 출력됨.
```

- 도구 호출 결과를 그대로 `tool_node`의 인자로 담아서 직접 실행
	- `tool_call`은 도구 호출 정보가 담긴 `AIMessage`
- `AIMessage`가 인자로 넘어가기 때문에 `“messages”` 키에 맞춰준다
	- [[MessagesState 1]] 에서 배운 내용 (메시지들은 `"messages"`로 관리)

## 참고

[[Tool Calling 1]]

[[MessagesState 1]]