import react from 'react';
import Layout from '../components/global/layout';
import "./style.scss";

export default function Offers1() {
  return (
    <>
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className='nmain-list mt-5 mb-5'>
          <div className='row mx-0'>
            <div className='col-md-12'>
              <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                  <div>
                    <button className='set-filter'><svg xmlns="http://www.w3.org/2000/svg" width="14px" aria-hidden="true" data-name="Layer 1" viewBox="0 0 14 14" role="img"><path d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z"></path></svg> Filter</button>

                  </div>

                  <div>
                    <select class="form-select sl ml-3" aria-label="Default select example">
                      <option selected>AlL Offers</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                </div>

                <div>
                  <button className='btn btn-primary d-flex align-items-center'><i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                    New offer</button>
                </div>


              </div>
            </div>
          </div>
          <div className='row mx-0 mt-3'>
            <div className='col-md-12'>
              <table class="table table-striped ">
                <thead class="thead-clr">
                  <tr >
                    <th scope="col">ID <i class="fa fa-caret-down" aria-hidden="true"></i></th>
                    <th scope="col">Image <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Name <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Category <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Channel <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Payout <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Payout type <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                    <th scope="col">Revenue <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>

                    <th scope="col">Status <i class="fa fa-caret-down" aria-hidden="true"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='table_row'>
                    <td>  #1 </td>
                    <td>
                      <img className='person-imgs' src='/assets/img/likjh.jpeg' alt=''></img>
                    </td>
                    <td><p className='td-set'>Person Name</p></td>
                    <td><p className='td-set'>Clothes</p></td>
                    <td><p className='td-set'>Facebook</p></td>
                    <td><a className='ref-mail' href=''>View</a></td>
                    <td><p className='td-set'>Custom</p></td>
                    <td><p className='td-set'>18%</p></td>
                    <td><span className='active-button'>Approved</span></td>
                  </tr>
                  <tr className='table_row'>
                    <td>  #1 </td>
                    <td>
                      <img className='person-imgs' src='/assets/img/likjh.jpeg' alt=''></img>
                    </td>
                    <td><p className='td-set'>Person Name</p></td>
                    <td><p className='td-set'>Clothes</p></td>
                    <td><p className='td-set'>Facebook</p></td>
                    <td><a className='ref-mail' href=''>View</a></td>
                    <td><p className='td-set'>Custom</p></td>
                    <td><p className='td-set'>18%</p></td>
                    <td><span className='active-button'>Approved</span></td>
                  </tr>
                  <tr className='table_row'>
                    <td>  #1 </td>
                    <td>
                      <img className='person-imgs' src='/assets/img/likjh.jpeg' alt=''></img>
                    </td>
                    <td><p className='td-set'>Person Name</p></td>
                    <td><p className='td-set'>Clothes</p></td>
                    <td><p className='td-set'>Facebook</p></td>
                    <td><a className='ref-mail' href=''>View</a></td>
                    <td><p className='td-set'>Custom</p></td>
                    <td><p className='td-set'>18%</p></td>
                    <td><span className='active-button'>Approved</span></td>
                  </tr>
                  <tr className='table_row'>
                    <td>  #1 </td>
                    <td>
                      <img className='person-imgs' src='/assets/img/likjh.jpeg' alt=''></img>
                    </td>
                    <td><p className='td-set'>Person Name</p></td>
                    <td><p className='td-set'>Clothes</p></td>
                    <td><p className='td-set'>Facebook</p></td>
                    <td><a className='ref-mail' href=''>View</a></td>
                    <td><p className='td-set'>Custom</p></td>
                    <td><p className='td-set'>18%</p></td>
                    <td><span className='active-button'>Approved</span></td>
                  </tr>
                </tbody>
              </table>


            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}