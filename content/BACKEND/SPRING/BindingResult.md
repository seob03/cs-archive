---
created: 2026-02-23T19:45:00+09:00
notion-id: 310737bad00c804ba589c6bd5c35b160
---
`BindingResult`는 **요청 데이터 바인딩(타입 변환 포함) + 검증(Validation)** 결과로 생긴 **에러 정보를 담아두는 객체**다. 컨트롤러 메서드 파라미터로 받아서 hasErrors() 같은 걸로 **“예외 터뜨리지 말고, 컨트롤러 안에서 직접 분기 처리”** 하려고 쓴다. 

`BindingResult`(또는 `Errors`)는 **해당 객체(**`@ModelAttribute` **/** `@RequestBody` **등) 파라미터의 바로 뒤에** 와야 한다. 그래야 스프링이 “이 객체에 대한 에러통”으로 인식한다.

참고로 `Errors` 인터페이스를 구현한 것이 `BindingResult`다. 컨트롤러에서 `Errors`로 받아도 되지만, 구현체인 `BindingResult`를 주로 컨트롤러에서 사용하게 된다.

```java
@PostMapping("/members")
public String save(@Valid @ModelAttribute MemberForm form, BindingResult bindingResult) {

    if (bindingResult.hasErrors()) {
        return "members/new-form"; // 에러 있으면 다시 폼
    }

    // 정상 처리
    return "redirect:/members";
}
```

- 변환 실패 or 검증 실패(`@Valid`) → `BindingResult`에 `Error` 객체들이 쌓이게 된다.
	- 변환 실패는 `@ModelAttribute` 과정에서 생기는 에러가 자동으로 쌓이게 되고
	- 검증 실패는 `@Valid` • `@Validated` 과정에서 생긴 에러가 쌓이게 된다.
- 참고로 `BindingResult`는 Model에 자동으로 담겨서 View로 전달된다.

### 참고

[[@Valid • @Validated]]