---
created: 2026-08-18T17:49:00+09:00
notion-id: 3be737bad00c8068af0ae778b48c64b4
---
Tool Calling은 LLM이 특정 작업을 수행하기 위해 외부 기능을 호출하는 기능이다. 이를 통해 LLM은 외부 API 통합 등의 더 복잡한 작업을 수행할 수 있게 된다.

### 도구 정의하기

```python
from langchain_community.tools import TavilySearchResults

# 검색할 쿼리 설정
query = "스테이크와 어울리는 와인을 추천해주세요."

# Tavily 검색 도구 초기화 (최대 2개의 결과 반환)
web_search = TavilySearchResults(max_results=2)

# 웹 검색 실행
search_results = web_search.invoke(query)

# 검색 결과 출력
for result in search_results:
    print(result)  
    print("-" * 100)  
    
# {'url': 'https://mashija.com/%EC%8A%A4%ED%85%8C%EC%9D%B4%ED%81%AC%EC%99%80-%EC%96%B4%EC%9A%B8%EB%A6%AC%EB%8A%94-%EC%B5%9C%EA%B3%A0%EC%9D%98-%EC%99%80%EC%9D%B8-%EB%AC%B4%EC%97%87%EC%9D%84-%EA%B3%A0%EB%A5%BC-%EA%B2%83%EC%9D%B8', 'content': '### 와인과 각종 주류, 관련 기사를 검색하세요.\n\n마시자 매거진\n마시자 매거진\n\n# 스테이크와 어울리는 최고의 와인: 무엇을 고를 것인가?\n\n# 스테이크와 어울리는 최고의 와인: 무엇을 고를 것인가?\n\n카베르네 소비뇽(Cabernet Sauvignon) 및 말벡(Malbec)과 같은 전형적인 선택부터 더 가벼운 레드 와인, 심지어 화이트 와인과 맛있는 스테이크를 페어링하는 방법까지, 우리의 아카이브에서 가져온 최고의 조언과 최근 디캔터 전문가가 추천한 와인을 소개한다.\n\n<스테이크를 곁들인 레드 와인을 위한 5가지 전형적인 선택>\n\n• 카베르네 소비뇽(Cabernet Sauvignon)  \n• 말벡(Malbec)  \n• 그르나슈/쉬라즈 블렌드(Grenache / Shiraz blends)  \n• 시라/쉬라즈(Syrah / Shiraz)  \n• 산지오베제(Sangiovese)\n\n육즙이 풍부한 스테이크와 맛있는 와인이 있는 저녁 식사는 적어도 고기 애호가들에게 인생의 큰 즐거움일 것이다.\n\n와인과 음식 페어링에서 새로운 시도를 하는 것은 항상 재미있지만, 특별한 스테이크 저녁 식사를 준비할 때 고려해야 할 몇 가지 스타일과 주의사항이 있다.\n\n<스테이크에 곁들이는 레드 와인>\n\n이 포도 품종을 세계 와인 무대에 재등장시키고 고품질 쇠고기에 대한 국가의 명성을 가진 아르헨티나 덕분에, 말벡 레드 와인은 스테이크와 함께 고전적인 매칭이 되었다.\n\n말벡의 풍부한 짙은 과일의 특징과 자연스러운 타닌은 일반적으로 좋은 스테이크와 잘 어울린다고 여겨지지만, 일부 전문가들은 더 신선한 스타일을 찾는 것을 제안한다. [...] 베켓은 또한 잘 익은 스테이크에 더 익은 과일 위주의 스타일의 레드 와인을 추천했다.\n\n– 소스 문제 –\n\n리차즈는 ‘와인을 선택할 때 소스와 사이드 디쉬도 마찬가지로 중요할 것이다. 베아네즈(béarnaise) 같은 크리미한 소스는 오크 향이 나는 와인과 잘 어울린다. 시라는 후추와 잘 어울린다.’라고 말했다.\n\n<화이트 와인과 스테이크>\n\n깜짝 놀란 마음을 무시하고, 스테이크 저녁 식사는 화이트 와인을 위한 장소가 아니라는 오래된 진언을 잊어버리지 않겠는가?\n\n결국 와인 세계에서 발견은 가장 흥미로운 것이다. 우리 기사에서 Le Cordon Bleu London의 마티유 롱게르(Matthieu Longuère MS)는 화이트 와인을 스테이크 및 기타 붉은 고기와 페어링할 수 있는 가능성에 관해 이야기한다.\n\n그는 숙성한 화이트 리오하(Rioja) 와인에서 피노 그리지오(Pinot Grigio)와 같은 다른 스타일에 맞게 식사를 미묘하게 조정하는 방법에 대한 생각에 이르기까지 다양한 옵션에 관해 썼다.\n\n작성자 Chris Mercer / 번역자 Bora Kim / 원문 기사 보기 / 이 기사는 Decanter의 저작물입니다.\n\nathur@winevision.kr\n\n### You Might also Like\n\n### Leave a Comment Cancel Comment\n\nYour email address will not be published. Required fields are marked \\\n\n다음 번 댓글 작성을 위해 이 브라우저에 이름, 이메일, 그리고 웹사이트를 저장합니다. [...] ‘멋지고 생동감 넘치는 카베르네 프랑(Cabernet Franc)은 어떤가? 아니면 카리냥(Carignan), 쌩소(Cinsault) 또는 서늘한 기후에서 생산한 시라(Syrah)는 어떨까? DWWA 칠레 지역 의장이자 Decanter Retailer Awards 회장인 리차즈는 “풀바디하지만 우아한 로제(rosé)도 따뜻한 날에는 잘 어울린다.”라고 말했다.\n\n그는 바디감과 질감이 있지만 스테이크 저녁 식사 중에 미각을 상쾌하게 할 수 있는 레드 와인을 즐긴다고 말하며, ‘스테이크의 리스크은 ‘무거운 육류 맛 = 무거운 와인’이라고 생각하는 것이다.’라고 말했다.\n\n– 피노 누아(Pinot Noir)는 스테이크와 어울리는가? –\n\n대부분의 피노 누아 와인은 스펙트럼의 라이트에서 미디엄 바디에 위치하는 경향이 있으므로, 그 프로필은 종종 더 가벼운 스타일의 육류와 페어링이 주를 이룬다.\n\n그럼에도, 피노 누아의 자연스러운 산도와 붉은 베리 과일은 스타일과 컷(cut)에 따라 스테이크 식사와 잘 어울린다.\n\n일반적으로 레어(rare)에서 미디엄 레어(medium-rare)로 요리된 필레(fillet)처럼 더 얇게 잘린 부위로 시도해 보자.'}
# ----------------------------------------------------------------------------------------------------
# {'url': 'https://m.blog.naver.com/chelina89/220634349414', 'content': "까베르네 소비뇽 100%로 역시 양조되어 묵직하고 풍부하고 파워풀한 캐릭터를 고스란히 나타내준답니다.\n\n\n\n개인적으로는 상큼하면서도 묵직한 여운이 있는 1865 화이트 와인 샤르도네도 애정하는 제품 중 하나예요!\n\n4. 루이마티니 나파밸리 까베르네 소비뇽 - 9만원 미만\n\n\n\n\n\n나파밸리의 아이콘 와인! 루이마티니!  \n미국 고급 와인 산지인 나파밸리 특유의 진득함과 파워풀함이 응축되어 있는 와인이라, 소고기랑 진짜 베스트 인거같아요 개인적으로.  \n한남동 한와담이나, 뚜뿔등심 처럼 콜키지 프리인 레스토랑에 정말 너무너무 잘 어울리는 스테이크 와인!\n\n\n\n오늘만큼은 우아하고 고급지게 스테이트와 와인 제대로 즐기고 싶다고 하면  \n진짜 후회 없는 와인이라고 생각한답니다. 생일에 한와담 블랙에서 함께 했는데, 이 와인을 빼놓고 가서 근처 한남리커에서 직접 바로 사왔다는!! ㅋㅋㅋㅋ\n\n\n\n고기와 나파밸리 와인이라~ 보기만 해도 벌써 군침이 도네요!\n\n5. 트라피체 싱글 빈야드 말벡 - 10만원 미만\n\n\n\n\n\n진한 품종으로 둘째가라면 서러운 말벡입니다.  \n아르헨티나 말벡 열풍의 선두주자 트라피체의 싱글빈야드 말벡! [...] 본문 바로가기\n\n# 블로그\n\n## 카테고리 이동 유나리's 블링블링 라이프\n\n검색\n\nWine\n\n### 레드 와인 추천! 스테이크와 어울리는 와인 베스트 5 - 10만원 미만 (1865, 카니버, 루이마티니, 트라피체)\n\n프로필 \n\n유나리\n\n2016. 2. 22. 11:28\n\n이웃추가\n\n 본문 폰트 크기 조정 가\n 공유하기\n URL복사\n 신고하기\n\n##### 레드 와인 추천 - 스테이크와 어울리는 와인 리스트! 10만원 미만\n\n카니버, 엑스트라버겐저, 1865, 루이마티니, 트라피체\n\n와인과 고기만큼 최상의 궁합을 자랑하는 페어링이 또 있을까용?!  \n직접 먹어보고 마셔보고! 수 많은 와인 중에서 고기와 베스트를 이루는 와인 추천 리스트 공개합니다♡\n\n1. 카니버 - 6만원 미만\n\n\n\n\n\n육식을 의미하는 카니버는 레이블 가운데에 발톱으로 긁힌 것 같은 스크래치가 나 있어요.  \n와인레이블 자체가 강인하고 강렬한 육식 동물의 모습을 고스란히 담아낸 만큼! 정말 고기와 함께 마시면 궁합이 최고랍니다.\n\n\n\n까베르네 소비뇽 100%로 양조되었고, 예전에 울프강 스테이크 하우스 에서도 다이닝 행사를 함께 한 와인이기도 해요.  \n개인적으로 가격도 6만원 미만으로(정가기준) 구매할 수 있는 합리적인 가격의 와인이구요.\n\n2. 엑스트라버겐저 블루레이블 - 3만7천원 / 엑스트라버겐저 레드레이블 - 4만5천원\n\n\n\n\n\n작년 10월 진행된 서울국제공연제는 물론, 이찬오 쉐프의 토크 쇼에도 함께 한 엑스트라버겐저 와인이예요.  \n레이블이 화려하고 너무 예쁘지 않나요?! [...] 엑스트라버겐저 의 의미는 화려한 광상곡 등 축제와 예술의 의미도 함께 담고 있어요. 그래서 와인을 보는 순간!   \n딱 화려하고 매혹적인 가면무도회가 연상됩니다.\n\n\n\n그리고 실제 엑스트라버겐저 와인은 요렇게 가면무도회를 개최 하기도 하였어요~  \n10/31 할로윈 데이를 맞이하여 열렸던 엑스트라버겐저 가면 파티! 진짜 너무 음식과도 잘 어울리고 컨셉도 재밌는 파티였답니다.\n\n\n\n참가자들 모두 가면 쓰고 ㅋㅋ 더 팔래스 호텔 서울에서 진행된 행사 였어요.\n\n\n\n진득한 와인의 풍미와 고기가 만나니 너무너무 육질도 부드러워 지는 거 있죠!  \n실제로 레드 와인의 약간의 떫은 탄닌이 고기의 질감을 부드럽고 더욱 감칠맛 나게 한다고 해요. 와인 한병으로 파티의 주인공이 되고 싶은 분들께 정말 강력 추천! 홈파티 와인으로도 딱인것 같아요.\n\n3. 국민와인 1865 까베르네 소비뇽! - 5만5천원 미만\n\n와인을 몰라도, 1865 와인을 모르는 사람은 거의 없다는 골프 매니아의 와인이자 국민와인 1865!  \n단일 브랜드로 최다 판매, 18홀을 65타에 치라는 행운의 와인! 5년 연속 사랑의 빨간띠 캠페인으로 나눔을 실천하는 와인 등 너무너무 다양한 별칭이 있는 와인이기도 하지요!\n\n\n\n\n\n특히 이번에는 더욱 레이블이 날렵해지고 깔끔해졌어요.   \n불필요한 정보들은 모두 걷어내고! 와인 본연의 캐릭터와 품질에 집중한 와인입니다.\n\n\n\n까베르네 소비뇽 100%로 역시 양조되어 묵직하고 풍부하고 파워풀한 캐릭터를 고스란히 나타내준답니다."}
# ----------------------------------------------------------------------------------------------------
```

Tool을 불러와서 `web_search`에 도구를 저장해둔 뒤 `invoke(query)`로 해당 도구를 내가 직접 호출한 모습이다.

### LLM에게 도구 호출시키기  
(Query → AIMessage)

```python
from langchain_openai import ChatOpenAI

# ChatOpenAI 모델 초기화
llm = ChatOpenAI(model="gpt-4o-mini")

# 웹 검색 도구를 직접 LLM에 바인딩 가능
llm_with_tools = llm.bind_tools(tools=[web_search])
```

- `llm = ChatOpenAI(model="gpt-4o-mini")`
	- 모델을 호출한 뒤에 LangChain 클래스로 감싸야 한다.
	- 그러면 Tool들을 LLM에 바인딩 할 수 있다.

```python
# 도구 호출이 필요 없는 LLM 호출을 수행
query = "안녕하세요."
ai_msg = llm_with_tools.invoke(query)

# LLM의 전체 출력 결과 출력
pprint(ai_msg)
print("-" * 100)

# 메시지 content 속성 (텍스트 출력)
pprint(ai_msg.content)
print("-" * 100)

# LLM이 호출한 도구 정보 출력
pprint(ai_msg.tool_calls)
print("-" * 100)

# AIMessage(content='안녕하세요! 어떻게 도와드릴까요?', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 11, 'prompt_tokens': 82, 'total_tokens': 93, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_e7eb9f2bc2', 'finish_reason': 'stop', 'logprobs': None}, id='run--cabf5916-698b-4fca-99b2-339ec8f1d450-0', usage_metadata={'input_tokens': 82, 'output_tokens': 11, 'total_tokens': 93})
# ----------------------------------------------------------------------------------------------------
# '안녕하세요! 어떻게 도와드릴까요?'
# ----------------------------------------------------------------------------------------------------
# []
# ----------------------------------------------------------------------------------------------------
```

- 도구 호출이 필요 없는 쿼리를 `invoke` 하는 경우에는 LLM이 직접 보고 판단한다.
- 이 경우에는 도구 호출이 필요 없다고 판단하여 호출한 도구가 없는 것을 볼 수 있다.

```python
# 도구 호출이 필요한 LLM 호출을 수행
query = "스테이크와 어울리는 와인을 추천해주세요."
ai_msg = llm_with_tools.invoke(query)

# LLM의 전체 출력 결과 출력
pprint(ai_msg)
print("-" * 100)

# 메시지 content 속성 (텍스트 출력)
pprint(ai_msg.content)
print("-" * 100)

# LLM이 호출한 도구 정보 출력
pprint(ai_msg.tool_calls)
print("-" * 100)

# AIMessage(content='', additional_kwargs={'tool_calls': [{'id': 'call_Ystn0n3a8I0RnL5ymFhx2IbO', 'function': {'arguments': '{"query":"스테이크와 어울리는 와인 추천"}', 'name': 'tavily_search_results_json'}, 'type': 'function'}], 'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 27, 'prompt_tokens': 91, 'total_tokens': 118, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_e7eb9f2bc2', 'finish_reason': 'tool_calls', 'logprobs': None}, id='run--3f215968-0dbc-482e-85ca-6089453965f0-0', tool_calls=[{'name': 'tavily_search_results_json', 'args': {'query': '스테이크와 어울리는 와인 추천'}, 'id': 'call_Ystn0n3a8I0RnL5ymFhx2IbO', 'type': 'tool_call'}], usage_metadata={'input_tokens': 91, 'output_tokens': 27, 'total_tokens': 118})
# ----------------------------------------------------------------------------------------------------
# ''
# ----------------------------------------------------------------------------------------------------
# [{'args': {'query': '스테이크와 어울리는 와인 추천'},
#   'id': 'call_Ystn0n3a8I0RnL5ymFhx2IbO',
#   'name': 'tavily_search_results_json',
#   'type': 'tool_call'}]
# ----------------------------------------------------------------------------------------------------
```

- 반대의 경우에는 `content` 속성이 비어있고 `tool_calls`의 인자에 도구가 적혀져 나온다.
- 이때 핵심은 도구 안에 도구의 이름 뿐만 아니라 `query`가 있다는 것이다.

### 도구 실행하기  
(AIMessage → ToolMessage)

```python
tool_call = ai_msg.tool_calls[0]

tool_message = web_search.invoke(tool_call)
print(tool_message)

# content='[{"url": "https://blog.naver.com/PostView.nhn?blogId=cyahnnn&logNo=222766631086", "content": "스테이크와 어울리는 와인 : 네이버 블로그 변경 전 공유된 블로그/글/클립 링크는 연결이 끊길 수 있습니다. 블로그 블로그 블로그 블로그 카베르네 소비뇽(Cabernet Sauvignon) 및 말벡(Malbec)과 같은 전형적인 선택부터 더 가벼운 레드 와인, 심지어 화이트 와인과 맛있는 스테이크를 페어링하는 방법까지, 우리의 아카이브에서 가져온 최고의 조언과 최근 디캔터 전문가가 추천한 와인을 소개한다. 그는 바디감과 질감이 있지만 스테이크 저녁 식사 중에 미각을 상쾌하게 할 수 있는 레드 와인을 즐긴다고 말하며, ‘스테이크의 리스크은 ‘무거운 육류 맛 = 무거운 와인’이라고 생각하는 것이다.’라고 말했다. 음식과 와인 전문가인 피오나 베켓(Fiona Becket)이 2007년 디캔터에서 스테이크와 함께 몇 가지의 고급 와인을 테이스팅한 후, ‘나는 일반적으로 피노 누아를 스테이크와 궁합이라고 생각하지 않지만, 고기를 레어(rare)로 요리했을 때 지금까지 최고의 궁합은 클래식하게 실크처럼 부드럽고 매혹적인 다니엘 리옹의 본 로마네(Daniel Rion, Vosne-Romanée 2001)이다’라고 썼다."}, {"url": "https://secrettsteaks.com/blog/steak-wine-pairing.php", "content": "스테이크와 가장 잘 어울리는 와인을 추천해드리며, 어떤 와인이 여러분의 식사 경험을 한층 더 업그레이드할 수 있을지 알아보겠습니다. 첫 번째로 추천하는 와인은 카베르네 소비뇽(Cabernet Sauvignon)입니다. 이 와인은 고소하고 진한 풍미가 특징으로, 스테이크의 육즙과 잘 어울립니다. 두 번째로 추천하는 와인은 시라(Syrah) 또는 쉬라즈(Shiraz)입니다. 이 와인은 오스트레일리아와 프랑스 등 여러 지역에서 생산되며, 각각의 지역 특색에 따라 다양한 풍미를 느낄 수 있습니다. 시라는 스파이시한 향과 함께 베리류의 풍부한 과일 향이 조화를 이루어, 그릴 스테이크나 바비큐 스타일의 스테이크와 잘 어울립니다. 세 번째로 추천하는 와인은 말벡(Malbec)입니다. 주로 아르헨티나에서 생산되는 이 와인은 부드럽고 풍부한 맛으로, 씹는 맛이 일품인 스테이크와 어울리기에 적합합니다. 네 번째로 추천하는 와인은 메를로(Merlot)입니다. 이 와인의 부드러운 맛은 스테이크의 풍미를 덮지 않고 자연스럽게 어우러져, 부담 없이 즐길 수 있는 조합을 만들어줍니다. 개인정보 처리 방침 개인정보 처리 방침 보기"}]' name='tavily_search_results_json' tool_call_id='call_yj3UhwPBxVhnK6qa49kXLHqB' artifact={'query': '스테이크와 어울리는 와인', 'follow_up_questions': None, 'answer': None, 'images': [], 'results': [{'title': '스테이크와 어울리는 와인 - 네이버 블로그', 'url': 'https://blog.naver.com/PostView.nhn?blogId=cyahnnn&logNo=222766631086', 'content': '스테이크와 어울리는 와인 : 네이버 블로그 변경 전 공유된 블로그/글/클립 링크는 연결이 끊길 수 있습니다. 블로그 블로그 블로그 블로그 카베르네 소비뇽(Cabernet Sauvignon) 및 말벡(Malbec)과 같은 전형적인 선택부터 더 가벼운 레드 와인, 심지어 화이트 와인과 맛있는 스테이크를 페어링하는 방법까지, 우리의 아카이브에서 가져온 최고의 조언과 최근 디캔터 전문가가 추천한 와인을 소개한다. 그는 바디감과 질감이 있지만 스테이크 저녁 식사 중에 미각을 상쾌하게 할 수 있는 레드 와인을 즐긴다고 말하며, ‘스테이크의 리스크은 ‘무거운 육류 맛 = 무거운 와인’이라고 생각하는 것이다.’라고 말했다. 음식과 와인 전문가인 피오나 베켓(Fiona Becket)이 2007년 디캔터에서 스테이크와 함께 몇 가지의 고급 와인을 테이스팅한 후, ‘나는 일반적으로 피노 누아를 스테이크와 궁합이라고 생각하지 않지만, 고기를 레어(rare)로 요리했을 때 지금까지 최고의 궁합은 클래식하게 실크처럼 부드럽고 매혹적인 다니엘 리옹의 본 로마네(Daniel Rion, Vosne-Romanée 2001)이다’라고 썼다.', 'score': 0.999826, 'raw_content': None}, {'title': '스테이크와 어울리는 와인 추천 - secrettsteaks.com', 'url': 'https://secrettsteaks.com/blog/steak-wine-pairing.php', 'content': '스테이크와 가장 잘 어울리는 와인을 추천해드리며, 어떤 와인이 여러분의 식사 경험을 한층 더 업그레이드할 수 있을지 알아보겠습니다. 첫 번째로 추천하는 와인은 카베르네 소비뇽(Cabernet Sauvignon)입니다. 이 와인은 고소하고 진한 풍미가 특징으로, 스테이크의 육즙과 잘 어울립니다. 두 번째로 추천하는 와인은 시라(Syrah) 또는 쉬라즈(Shiraz)입니다. 이 와인은 오스트레일리아와 프랑스 등 여러 지역에서 생산되며, 각각의 지역 특색에 따라 다양한 풍미를 느낄 수 있습니다. 시라는 스파이시한 향과 함께 베리류의 풍부한 과일 향이 조화를 이루어, 그릴 스테이크나 바비큐 스타일의 스테이크와 잘 어울립니다. 세 번째로 추천하는 와인은 말벡(Malbec)입니다. 주로 아르헨티나에서 생산되는 이 와인은 부드럽고 풍부한 맛으로, 씹는 맛이 일품인 스테이크와 어울리기에 적합합니다. 네 번째로 추천하는 와인은 메를로(Merlot)입니다. 이 와인의 부드러운 맛은 스테이크의 풍미를 덮지 않고 자연스럽게 어우러져, 부담 없이 즐길 수 있는 조합을 만들어줍니다. 개인정보 처리 방침 개인정보 처리 방침 보기', 'score': 0.9996331, 'raw_content': None}], 'response_time': 2.31}
```

- `AIMessage`에는 `llm`이 필요하다고 적어놓은 도구들을 `tool_calls` 리스트에 보관하고 있다.
	- 여기서는 도구를 따로 `tool_call` 변수에 담아둔 것 뿐이다.
- `web_search.invoke(tool_call)`를 통해 `toolMessage` 객체를 생성한다.
- 해당 `tool_call` 도구에 들어있던 `query`가 도구의 쿼리 인자로 알아서 들어감.

참고로 여러 도구가 있는 경우에는 `.invoke()`가 아니라 `.batch()`로 동시 실행을 할 수 있다.

### 도구 기반 LLM 답변 완성까지  
(ToolMessage → Answer)

```python
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableConfig, chain

# 오늘 날짜 설정
today = datetime.today().strftime("%Y-%m-%d")

# 프롬프트 템플릿 
prompt = ChatPromptTemplate([
    ("system", f"You are a helpful AI assistant. Today's date is {today}."),
    ("human", "{user_input}"),
    ("placeholder", "{messages}"),
])

# ChatOpenAI 모델 초기화 
llm = ChatOpenAI(model="gpt-4o-mini")

# LLM에 도구를 바인딩
llm_with_tools = llm.bind_tools(tools=[web_search])

# LLM 체인 생성 (LCEL 사용)
llm_chain = prompt | llm_with_tools

# 도구 실행 체인 정의
@chain
def web_search_chain(user_input: str, config: RunnableConfig):
    input_ = {"user_input": user_input}
    ai_msg = llm_chain.invoke(input_, config=config)
    print("ai_msg: \n", ai_msg)
    print("-"*100)
    tool_msgs = web_search.batch(ai_msg.tool_calls, config=config)
    print("tool_msgs: \n", tool_msgs)
    print("-"*100)
    return llm_chain.invoke({**input_, "messages": [ai_msg, *tool_msgs]}, config=config)

# 체인 실행
response = web_search_chain.invoke("오늘 모엣샹동 샴페인의 가격은 얼마인가요?")

# 응답 출력 
pprint(response.content)

# ai_msg: 
#  content='' additional_kwargs={'tool_calls': [{'id': 'call_Rq69dR1M4NvUAJcbyI0PAYx9', 'function': {'arguments': '{"query":"모엣샹동 샴페인 가격 2024년 10월"}', 'name': 'tavily_search_results_json'}, 'type': 'function'}], 'refusal': None} response_metadata={'token_usage': {'completion_tokens': 35, 'prompt_tokens': 114, 'total_tokens': 149, 'completion_tokens_details': {'audio_tokens': None, 'reasoning_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_f85bea6784', 'finish_reason': 'tool_calls', 'logprobs': None} id='run-007fd1f9-bba2-4d37-9561-647da19b569c-0' tool_calls=[{'name': 'tavily_search_results_json', 'args': {'query': '모엣샹동 샴페인 가격 2024년 10월'}, 'id': 'call_Rq69dR1M4NvUAJcbyI0PAYx9', 'type': 'tool_call'}] usage_metadata={'input_tokens': 114, 'output_tokens': 35, 'total_tokens': 149}
# ----------------------------------------------------------------------------------------------------
# tool_msgs: 
#  [ToolMessage(content='[{"url": "https://dailyshot.co/m/item/4216", "content": "모엣 샹동 임페리얼 전국 가격비교하고 구매 | 데일리샷에서 모든 와인 가격 비교하고 내 주변에서 구매하기 2024 [10월 월간 돌고래] 모엣 샹동 임페리얼 모엣 샹동 하우스의 상징 \'모엣 샹동 임페리얼\'은 모엣 샹동 하우스의 상징적인 샴페인입니다. 1869년 탄생한 이 샴페인은\xa0모엣 샹동의 독보적인 스타일을 완벽하게 보여줄 수 있는 와인으로, 밝은 과실 아로마와 상쾌한 기포를 자랑합니다. 특별한 날을 더욱 빛내주는 모엣 샹동 임페리얼 \'모엣 샹동 임페리얼\'은 초록빛이 은은하게\xa0감도는 금빛 볏짚 색깔을 띱니다. 사랑받는 샴페인, 모엣 샹동 모엣 샹동(Moet & Chandon)은 세계에서 가장 큰 샴페인 하우스입니다. \'샴페인의 마법을 세상에 나눈다\'는 신조에 따라 개성 넘치는 샴페인들을 선보이는 모엣 샹동은 오늘날 세계에서 가장 사랑받는 샴페인 생산자 중 하나로 자리 잡았습니다. 4.0 스토어 보글 팬텀 샤르도네 37,000원 4.0 (1) 3.3 스토어 윈담 에스테이트, 빈 222 샤르도네 32,000원"}, {"url": "https://m.blog.naver.com/sbj5817/223342722157", "content": "모엣샹동 임페리얼 브뤼. 청량한 탄산 가득한 홈파티 샴페인. 존재하지 않는 이미지입니다. 지난 생일 친구의 내돈내산 선물로 모엣샹동 임페리얼 샴페인을 마셔보았다. 청량하면서 시원하게 터지는 탄산감이 제대로였던 시음 후기와 함께 모엣샹동 가격 안내도 ..."}]', name='tavily_search_results_json', tool_call_id='call_Rq69dR1M4NvUAJcbyI0PAYx9', artifact={'query': '모엣샹동 샴페인 가격 2024년 10월', 'follow_up_questions': None, 'answer': None, 'images': [], 'results': [{'title': '모엣 샹동 임페리얼 전국 가격비교하고 구매 | 데일리샷에서 모든 와인 가격 비교하고 내 주변에서 구매하기 2024', 'url': 'https://dailyshot.co/m/item/4216', 'content': "모엣 샹동 임페리얼 전국 가격비교하고 구매 | 데일리샷에서 모든 와인 가격 비교하고 내 주변에서 구매하기 2024 [10월 월간 돌고래] 모엣 샹동 임페리얼 모엣 샹동 하우스의 상징 '모엣 샹동 임페리얼'은 모엣 샹동 하우스의 상징적인 샴페인입니다. 1869년 탄생한 이 샴페인은\xa0모엣 샹동의 독보적인 스타일을 완벽하게 보여줄 수 있는 와인으로, 밝은 과실 아로마와 상쾌한 기포를 자랑합니다. 특별한 날을 더욱 빛내주는 모엣 샹동 임페리얼 '모엣 샹동 임페리얼'은 초록빛이 은은하게\xa0감도는 금빛 볏짚 색깔을 띱니다. 사랑받는 샴페인, 모엣 샹동 모엣 샹동(Moet & Chandon)은 세계에서 가장 큰 샴페인 하우스입니다. '샴페인의 마법을 세상에 나눈다'는 신조에 따라 개성 넘치는 샴페인들을 선보이는 모엣 샹동은 오늘날 세계에서 가장 사랑받는 샴페인 생산자 중 하나로 자리 잡았습니다. 4.0 스토어 보글 팬텀 샤르도네 37,000원 4.0 (1) 3.3 스토어 윈담 에스테이트, 빈 222 샤르도네 32,000원", 'score': 0.9992706, 'raw_content': None}, {'title': '모엣샹동 임페리얼 가격 청량함 가득 샴페인 한잔 : 네이버 블로그', 'url': 'https://m.blog.naver.com/sbj5817/223342722157', 'content': '모엣샹동 임페리얼 브뤼. 청량한 탄산 가득한 홈파티 샴페인. 존재하지 않는 이미지입니다. 지난 생일 친구의 내돈내산 선물로 모엣샹동 임페리얼 샴페인을 마셔보았다. 청량하면서 시원하게 터지는 탄산감이 제대로였던 시음 후기와 함께 모엣샹동 가격 안내도 ...', 'score': 0.9662198, 'raw_content': None}], 'response_time': 1.75})]
# ----------------------------------------------------------------------------------------------------
# ('현재 모엣샹동 임페리얼 샴페인의 가격은 약 37,000원부터 시작하는 것으로 보입니다. 정확한 가격은 판매처에 따라 다를 수 있으므로, '
#  '[여기](https://dailyshot.co/m/item/4216)에서 자세한 가격비교와 구매 정보를 확인할 수 있습니다.')
```

1. 사용자 질문 입력: `"오늘 모엣샹동 샴페인의 가격은 얼마인가요?"`
2. `web_search_chain.invoke(쿼리)`를 통한 Chain 실행된다.
	- `@Chain`을 통해 평범한 파이썬 함수를 LangChain Runnable로 만들 수 있다.
3. 도구 실행 체인이 실행되면서 LCEL로 만든 `llm_chain`이 실행된다. **(첫 번째 LLM 호출)**
	- `llm`은 평균 가격을 알고 있다고 해도 오늘 가격에 대해서는 확실하게 대답하기 어렵다.
	- 따라서 `llm`은 바로 답변을 내놓는 것이 아니라 모델 리스트를 담은 `AIMessage` 반환한다.
	- `ai_msg`의 결과를 보면 `content`가 비어있고, 필요한 도구를 리스트로 담아서 반환한다.
4. `AIMessage`를 통해 얻은 도구 리스트인 `tool_calls`를 통해 `ToolMessage` 생성한다.
	- 이때 리스트에 여러 도구가 있을 수 있기 때문에 `.batch()`를 통해 호출했다.
	- 생성된 `ToolMessage`를 보면 도구를 사용해서 얻어낸 웹 검색 내용이 나온다.
5. 얻어낸 `ToolMessage`를 `llm_chain`을 호출한다. **(두 번째 LLM 호출)**
	- 도구로 검색한 결과들이 `prompt`의 인자로 들어간 채로 `llm`에게 입력된다.
	- 아까와는 상황이 다르다. 이제는 “오늘”의 모엣샹동 가격이 쿼리에 포함되어 있다.
	- 따라서 이제는 도구 호출 없이 최종 답변을 할 수 있게 된다.
	참고로 `tool_msgs`는 리스트여서 `*`를 통해 리스트 언패킹을 했고 `input_`은 딕셔너리여서 `**`를 통해 딕셔너리 언패킹 방법 한 것이다.

### 참고
[[LCEL 체인]]