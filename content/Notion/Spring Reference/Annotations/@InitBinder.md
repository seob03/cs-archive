---
notion-id: 310737bad00c8075a326cc5fd61d8ff8
---
`@InitBinder`는 **컨트롤러에서 요청 파라미터를 객체로 바인딩할 때 쓰는 WebDataBinder를 미리 설정(검증기 등록, 바인딩/포맷 규칙 추가 등)하는 초기화 메서드**를 지정하는 애노테이션이다. (해당 컨트롤러에만 적용)

```java
@InitBinder
public void init(WebDataBinder dataBinder) {
		dataBinder.addValidators(itemValidator);
}
```

```java
@Component 
public class ItemValidator implements Validator { 
		// 검증기는 Validator를 구현하면 된다.
		
    @Override
    public boolean supports(Class<?> clazz) {
        return Item.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
				Item item = (Item) target;

				// 검증 로직
        if (!StringUtils.hasText(item.getItemName())) {
            errors.rejectValue("itemName", "required");
        }
        if (item.getPrice() == null || item.getPrice() < 1000 || item.getPrice() > 1000000) {
            errors.rejectValue("price", "range", new Object[]{1000, 10000000}, null);
        }
        if (item.getQuantity() == null || item.getQuantity() >= 9999) {
            errors.rejectValue("quantity", "max", new Object[]{9999}, null);
        }

        //특정 필드가 아닌 복합 룰 검증
        if (item.getPrice() != null && item.getQuantity() != null) {
            int resultPrice = item.getPrice() * item.getQuantity();
            if (resultPrice < 10000) {
                errors.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
            }
        }
    }
}
```

- 검증기는 `Validator`를 구현한 뒤에 `supports()`와 `validate()`를 구현하면 된다.
	- `supports()` : 이 검증기가 해당(`clazz`) 타입에 사용될 수 있는 지를 판별
	- `validate()` : 실제 검증 로직을 담당하고, 문제가 있으면 `Errors`에 기록
- `supports()`와 `validate()`를 구현하고 `addValidator`로 `WebDataBinder`에 추가하면 된다.
	- 이렇게 등록을 해 놓으면 컨트롤러에서 검증기를 컨트롤러에서 직접 호출하지 않아도 된다.
	- 검증할 대상 앞에 `@Valid` 또는 `@Validated`를 붙여주기만 하면 자동으로 검증이 된다.
- 검증에서 걸러진 경우에는 `errors.rejectValue()`로 에러 정보를 `Errors` 객체에 담아두면 된다.
	- 참고로 `Errors` 인터페이스의 대표 구현체가 `BindingResult`다.

### 참고

[[BindingResult]]

[[reject() • rejectValue()]]

[[@Valid • @Validated]]