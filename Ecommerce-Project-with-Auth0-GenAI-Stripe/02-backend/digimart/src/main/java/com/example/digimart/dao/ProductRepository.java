package com.example.digimart.dao;

import com.example.digimart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);
    // this is an endpoint that corresponds to "https://localhost:8443/api/products/search/findByCategoryId?id=something"
    // and will return all products having category id  = something


    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    // above corresponds to endpoint "https://localhost:8443/api/products/search/findBynameContaining?name=something"
    // this is used while implementing the "search by keyword" functionality
    // we pass the keyword "name" through url and using this method, spring data rest returns all products whose name contains the passed keyword(keyword is represented by the word name in url).





//    We did not need to explicitly define endpoints for above two methods because Spring Data REST auto-creates endpoints for simple queries (like findByCategoryId) via naming convention.
//    We can directly use these endpoints (like the ones i have mentioned above). Also to avail this facility of getting auto exposed endpoints, there are certain requirements:
//    It's a finder method following Spring Data naming conventions.
//    The method is placed inside a Repository interface that extends JpaRepository.
//    You annotate the repository with @RepositoryRestResource.
//
//    Above 2 methods followed this.They were simple queries and hence Spring data rest fetched the required data and auto created those endpoints. Basically Spring Data REST only exposes read-only finder methods automatically and only return a Page .
//    But in cases, where we require some custom-advanced db querying or modifying the db, we have to define custom methods(these may not follow the standard naming convention ie it may not begin with findBy, countBy, existsBy, etc., also since its not standard method, it can return anything, not just page).
//    And since we have this custom method, spring data rest will not provide auto created endpoints. we have to define endpoints as well in controller.

    List<Product> findByDescriptionIsNullOrDescription(String description);

}
