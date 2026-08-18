---
created: 2026-02-26T19:58:00+09:00
notion-id: 30d737bad00c80cb863bd11af8e9548f
---
`@RequiredArgsConstructor`는 **final 필드(+@NonNull 붙은 필드)만 골라서 생성자를 자동 생성**해주는 Lombok 애노테이션이다.

```java
@Component
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy;

    /* -> 롬복이 만들어주기 때문에 주석 처리 해도 됨
    @Autowired
    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository =  memberRepository;
        this.discountPolicy = discountPolicy;
    }*/

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {
        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice); // 단일 책임 원칙 잘 지킴

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
```

- 생성자가 1개여서 `@Autowired`를 생략할 수 있을 때 + `final` 필드일 때 사용한다.
	- 생성자가 2개 이상인 경우에는 `@Autowired`가 자동으로 주입되지 않는다.
- 최근에는 생성자를 1개만 두고 `@Autowired`를 생략하는 방법을 사용하기 때문에 `@RequiredArgsConstructor`를 사용하기 좋다.

### 참고

[[@Autowired]]