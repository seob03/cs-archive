---
notion-id: 3c0737bad00c803ca9a0da1d4eaed572
---
`@tool`은 일반적인 파이썬 함수를 LLM이 사용할 수 있는 LangChain Tool로 포장해 주는 데코레이터다. 데코레이터 자체가 실행을 해주는 것은 아니고, 도구를 등록해두는 것과 같다. 공부해본 결과 스프링의 `@Bean`과 비슷하다.

## @tool을 통해 단순 함수를 Tool 객체로 변환하기

```python
from langchain_community.tools import TavilySearchResults
from langchain_core.tools import tool
from typing import List

# Tool 정의 
@tool
def search_web(query: str) -> str:
    """Searches the internet for information that does not exist in the database or for the latest information."""

    tavily_search = TavilySearchResults(max_results=2)
    docs = tavily_search.invoke(query)

    formatted_docs = "\n---\n".join([
        f'<Document href="{doc["url"]}"/>\n{doc["content"]}\n</Document>'
        for doc in docs
        ])

    if len(formatted_docs) > 0:
        return formatted_docs
    
    return "관련 정보를 찾을 수 없습니다."
```

- `@tool`: 일반 파이썬 함수인 `search_web`을 LangChain Tool 객체로 변환
	- 도구를 LangChain 객체로 변환했기 때문에 나중에 LLM에 전달하기가 쉬워짐.
- `TavilySearchResults`: Tavily 검색 API를 LangChain Tool 형태로 감싼 클래스
	- 원래라면 HTTP 요청을 보내서 사용하지만, `invoke()`만으로도 검색이 가능해짐.
- 현재 코드 구조상 내가 만든 도구 안에서 Tavily 도구를 사용하는 구조다.
	- 대신에 그대로 사용하는 것이 아니라, format 방식을 커스텀했다.

```
Tool
├─ name: search_web
├─ description: Searches the internet ...
└─ arguments
     └─ query: str
```

- LangChain이 이런 식으로 함수를 분석해서 Tool로 만들어 준다.

Tool을 정의할 때 주석처럼 보이는 부분이 있는데, 이 부분은 `description`이다. 이 부분은 LLM이 이 Tool을 언제 써야 하는지 판단할 때 설명 부분을 참고해서 판단하기 때문에 신경써서 작성해 두어야 한다.

```python
query = "스테이크와 어울리는 와인을 추천해주세요."
search_result = search_web.invoke(query)

print(search_result)

#<Document href="https://secrettsteaks.com/blog/steak-wine-pairing.php"/>
\#스테이크와 가장 잘 어울리는 와인을 추천해드리며, 어떤 와인이 여러분의 식사 경험을 한층 더 업그레이드할 수 있을지 알아보겠습니다. 첫 번째로 추천하는 와인은 카베르네 소비뇽(Cabernet Sauvignon)입니다. 이 와인은 고소하고 진한 풍미가 특징으로, 스테이크의 육즙과 잘 어울립니다. 두 번째로 추천하는 와인은 시라(Syrah) 또는 쉬라즈(Shiraz)입니다. 이 와인은 오스트레일리아와 프랑스 등 여러 지역에서 생산되며, 각각의 지역 특색에 따라 다양한 풍미를 느낄 수 있습니다. 시라는 스파이시한 향과 함께 베리류의 풍부한 과일 향이 조화를 이루어, 그릴 스테이크나 바비큐 스타일의 스테이크와 잘 어울립니다. 세 번째로 추천하는 와인은 말벡(Malbec)입니다. 주로 아르헨티나에서 생산되는 이 와인은 부드럽고 풍부한 맛으로, 씹는 맛이 일품인 스테이크와 어울리기에 적합합니다. 네 번째로 추천하는 와인은 메를로(Merlot)입니다. 이 와인의 부드러운 맛은 스테이크의 풍미를 덮지 않고 자연스럽게 어우러져, 부담 없이 즐길 수 있는 조합을 만들어줍니다. 개인정보 처리 방침 개인정보 처리 방침 보기
#</Document>
\#---
#<Document href="https://blog.naver.com/PostView.naver?blogId=chelina89&logNo=220634349414&noTrackingCode=true"/>
\#스테이크와 어울리는 와인 베스트 5 - 10만원 미만 (1865, 카니버, 루이마티니, 트라피체) 수 많은 와인 중에서 고기와 베스트를 이루는 와인 추천 리스트 공개합니다♡ 까베르네 소비뇽 100%로 양조되었고, 예전에 울프강 스테이크 하우스 에서도 다이닝 행사를 함께 한 와인이기도 해요.개인적으로 가격도 6만원 미만으로(정가기준) 구매할 수 있는 합리적인 가격의 와인이구요. 4. 루이마티니 나파밸리 까베르네 소비뇽 - 9만원 미만 루이마티니!미국 고급 와인 산지인 나파밸리 특유의 진득함과 파워풀함이 응축되어 있는 와인이라, 소고기랑 진짜 베스트 인거같아요 개인적으로.한남동 한와담이나, 뚜뿔등심 처럼 콜키지 프리인 레스토랑에 정말 너무너무 잘 어울리는 스테이크 와인! 위의 추천드린 레드 와인 베스트 5 와 함께 하심은 어떠실까요?! 저작권을 침해하는 컨텐츠가 포함되어 있는 게시물의 경우 글보내기 기능을 제한하고 있습니다. 저작권을 침해하는 컨텐츠가 포함되어 있는 게시물의 경우 주제 분류 기능을 제한하고 있습니다.
#</Document>
```

- 도구에 쿼리를 넣고 직접 호출한 결과 → 검색 결과가 포맷팅된 구조로 출력된다.

```python
llm_with_tools = llm.bind_tools(tools=[search_web])
query = "스테이크와 어울리는 와인을 추천해주세요."
ai_msg = llm_with_tools.invoke(query)

# LLM의 전체 출력 결과 출력
pprint(ai_msg) 
	# AIMessage(content='', additional_kwargs={'tool_calls': [{'id': 'call_aeofLGwEibzDij97d0GGnuA9', 'function': {'arguments': '{"query": "스테이크와 어울리는 와인 추천"}', 'name': 'search_web'}, 'type': 'function'}, {'id': 'call_kvnFgHFNAlS3TfUBitGkE6lV', 'function': {'arguments': '{"query": "스테이크에 가장 잘 맞는 와인"}', 'name': 'search_web'}, 'type': 'function'}, {'id': 'call_lPlnIYRnu0U9P7iunkbCbAuR', 'function': {'arguments': '{"query": "스테이크 와인 페어링 가이드"}', 'name': 'search_web'}, 'type': 'function'}], 'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 85, 'prompt_tokens': 67, 'total_tokens': 152, 'completion_tokens_details': {'audio_tokens': None, 'reasoning_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_f85bea6784', 'finish_reason': 'tool_calls', 'logprobs': None}, id='run-35980c25-a891-48e9-8251-6f536b1b6513-0', tool_calls=[{'name': 'search_web', 'args': {'query': '스테이크와 어울리는 와인 추천'}, 'id': 'call_aeofLGwEibzDij97d0GGnuA9', 'type': 'tool_call'}, {'name': 'search_web', 'args': {'query': '스테이크에 가장 잘 맞는 와인'}, 'id': 'call_kvnFgHFNAlS3TfUBitGkE6lV', 'type': 'tool_call'}, {'name': 'search_web', 'args': {'query': '스테이크 와인 페어링 가이드'}, 'id': 'call_lPlnIYRnu0U9P7iunkbCbAuR', 'type': 'tool_call'}], usage_metadata={'input_tokens': 67, 'output_tokens': 85, 'total_tokens': 152})

# LLM이 호출한 도구 정보 출력
pprint(ai_msg.tool_calls)
	# [{'args': {'query': '스테이크와 어울리는 와인 추천'},
	#  'id': 'call_aeofLGwEibzDij97d0GGnuA9',
	#  'name': 'search_web',
	#  'type': 'tool_call'},
	# {'args': {'query': '스테이크에 가장 잘 맞는 와인'},
	#  'id': 'call_kvnFgHFNAlS3TfUBitGkE6lV',
	#  'name': 'search_web',
	#  'type': 'tool_call'},
	# {'args': {'query': '스테이크 와인 페어링 가이드'},
	#  'id': 'call_lPlnIYRnu0U9P7iunkbCbAuR',
	#  'name': 'search_web',
	#  'type': 'tool_call'}]
```

- 데코레이터 덕분에 LLM에 바인딩을 쉽게 할 수 있고, Tool Calling이 되는 모습이다.

## 참고

[Tool Calling](https://app.notion.com/p/Tool-Calling-3be737bad00c8068af0ae778b48c64b4?pvs=21)