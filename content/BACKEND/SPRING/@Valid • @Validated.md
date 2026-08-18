---
created: 2026-02-23T20:16:00+09:00
notion-id: 310737bad00c8031a764db3881a3edf9
---
`@Valid`와 `@Validated` 둘 다 **스프링에서 Bean Validation(객체 검증)을 트리거해서 제약조건 위반을 검출**하게 해주는 애노테이션이다.

```java
@PostMapping("/members")
public String save(@Valid @ModelAttribute MemberForm form, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) 
		    return "members/new-form";
    return "redirect:/members";
}
```

- `@Valid`를 붙여주기만 하면 그 대상 객체인 `form`이 자동으로 검증이 실행된다.
- 이때 검증은 WebDataBinder(`@InitBinder`)에 등록된 Validator들이 자동으로 실행된다.
- 만약 `@InitBinder`에서 등록한 검증기로 검증을 돌리는데 검증에 실패하면?
	- 해당 검증기에서 `BindingResult`에 `rejectValue()` • `reject()`로 에러 객체를 담는다.
	- 따라서 검증이 끝나면 `BindingResult`의 에러 객체의 유무 자체로 유효성 판별이 가능하다.

### 참고

[[@InitBinder]]

[[BindingResult]]

[[reject() • rejectValue()]]