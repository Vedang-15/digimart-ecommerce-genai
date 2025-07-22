package com.example.digimart.dao;

import com.example.digimart.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("https://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
// name of JSON entry will be : productCategory, and the custom path will now be : /product-category, this will happen due to above annotation
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    // that's it! nothing else to do here
}
