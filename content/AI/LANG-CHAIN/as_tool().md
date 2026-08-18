---
created: 2026-08-18T19:56:42+09:00
notion-id: 3c0737bad00c8012a2cede85c70083e6
---
단순 함수에서는 `@tool`을 통해 도구를 만들었지만, 이미 만들어둔 chain이나 Runnable 객체에 대해서도 `RunnableLambda → as_tool()` 방식으로도 Tool을 만들 수 있다.

```python
# WikipediaLoader를 사용하여 위키피디아 문서를 검색하는 함수 
def search_wiki(input_data: dict) -> List[Document]:
    """Search Wikipedia documents based on user input (query) and return k documents"""
    query = input_data["query"]
    k = input_data.get("k", 2)  
    wiki_loader = WikipediaLoader(query=query, load_max_docs=k, lang="ko")
    wiki_docs = wiki_loader.load()
    return wiki_docs

# 도구 호출에 사용할 입력 스키마 정의 
class WikiSearchSchema(BaseModel):
    """Input schema for Wikipedia search."""
    query: str = Field(..., description="The query to search for in Wikipedia")
    k: int = Field(2, description="The number of documents to return (default is 2)")

# RunnableLambda 함수를 사용하여 위키피디아 문서 로더를 Runnable로 변환 
runnable = RunnableLambda(search_wiki)
wiki_search = runnable.as_tool(
    name="wiki_search",
    description=dedent("""
        Use this tool when you need to search for information on Wikipedia.
        It searches for Wikipedia articles related to the user's query and returns
        a specified number of documents. This tool is useful when general knowledge
        or background information is required.
    """),
    args_schema=WikiSearchSchema
)
```

- `runnable = RunnableLambda(search_wiki)`
	- 일반 파이썬 함수인 `search_wiki`를 LangChain의 Runnable 객체로 변환했다.
	- 따라서 이제 랭체인의 `invoke()`나 `batch()` 방식으로 직접 실행할 수도 있다.
- `wiki_search = runnable.as_tool(…)`
	- Runnable 객체를 LLM이 호출할 수 있는 Tool로 변환했다.
	- 이름과 도구 설명, 도구가 입력받을 입력 형식 스키마를 모두 필요하다.

참고로 단순히 이 방식의 경우에는 `@tool`로 하는 것이 더 간단하다.

```python
# LLM에 도구를 바인딩 (2개의 도구 바인딩)
llm_with_tools = llm.bind_tools(tools=[search_web, wiki_search])
query = "서울 강남의 유명한 파스타 맛집은 어디인가요? 그리고 파스타의 유래를 알려주세요. "
ai_msg = llm_with_tools.invoke(query)

# LLM의 전체 출력 결과 출력
pprint(ai_msg)
	# AIMessage(content='', additional_kwargs={'tool_calls': [{'id': 'call_liU26lIOUMiiSEnWPhZvh2RZ', 'function': {'arguments': '{"query": "서울 강남 유명 파스타 맛집"}', 'name': 'search_web'}, 'type': 'function'}, {'id': 'call_4DfoAzdWKcNilh9VJQvx97vu', 'function': {'arguments': '{"query": "파스타"}', 'name': 'wiki_search'}, 'type': 'function'}], 'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 53, 'prompt_tokens': 174, 'total_tokens': 227, 'completion_tokens_details': {'audio_tokens': None, 'reasoning_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_74ba47b4ac', 'finish_reason': 'tool_calls', 'logprobs': None}, id='run-746515d5-78de-44c8-b3bf-a421a3c1b230-0', tool_calls=[{'name': 'search_web', 'args': {'query': '서울 강남 유명 파스타 맛집'}, 'id': 'call_liU26lIOUMiiSEnWPhZvh2RZ', 'type': 'tool_call'}, {'name': 'wiki_search', 'args': {'query': '파스타'}, 'id': 'call_4DfoAzdWKcNilh9VJQvx97vu', 'type': 'tool_call'}], usage_metadata={'input_tokens': 174, 'output_tokens': 53, 'total_tokens': 227})

# LLM이 호출한 도구 정보 출력
pprint(ai_msg.tool_calls)
	#[{'args': {'query': '서울 강남 유명 파스타 맛집'},
	#  'id': 'call_liU26lIOUMiiSEnWPhZvh2RZ',
	#  'name': 'search_web',
	#  'type': 'tool_call'},
	# {'args': {'query': '파스타'},
	#  'id': 'call_4DfoAzdWKcNilh9VJQvx97vu',
	#  'name': 'wiki_search',
	#  'type': 'tool_call'}]
```

  

## 참고

[[@tool]]