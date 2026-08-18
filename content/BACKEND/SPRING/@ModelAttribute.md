---
created: 2026-08-14T18:08:55+09:00
notion-id: 310737bad00c80af99bed2574299c508
---
`@ModelAttribute`는 **요청 파라미터(쿼리 형식** ⭐**)를 객체(DTO)에 자동 바인딩하고**, 그 객체를 **모델(Model)에 같이 담아 뷰로 넘겨주는** 애노테이션이다. 요청 파라미터(쿼리 스트링, form-urlencoded)를 꺼내서 객체 필드에 자동으로 채워준다.

```java
// URL: /search?keyword=spring&page=2
@GetMapping("/search")
public String search(@ModelAttribute SearchCond cond) {
    // cond.keyword = "spring" 자동 할당
    // cond.page = 2 자동 할당
    return "ok";
}

@Data
static class SearchCond {
    private String keyword;
    private int page;
}
```

- `**@ModelAttribute**`**은 쿼리 형태(**==`**변수1=값1&변수2=값2**`==**)만 읽을 수 있다. ⭐**
	- 정확히는 URL-encoded 파라미터 형식을 읽을 수 있다.
- **그래서 JSON 같은** ==`**{ 변수1 : 값1, 변수2 : 값2 }**`== **형태는 읽을 수 없다. ⭐**
	- 그래서 JSON 바디는 `@RequestBody`가 따로 담당한다.
- 참고로 view에 객체 외에도 다른 정보를 추가로 담고 싶다면 `Model` 파라미터를 활용하자.
	- `model.addAttribute(key, value)`로 사용이 가능하다.==→ 참고로 key에는 뷰 템플릿에서 참조할 변수명이 들어가면 되고==  
		==→ value에 뷰로 넘길 데이터 객체를 넣어주면 된다.==

### 참고

[[URL-encoded 파라미터 형식]]

[[@RequestBody]]